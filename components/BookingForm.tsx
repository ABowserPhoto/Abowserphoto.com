"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { submitBooking, type BookingFormData } from "../actions/submitBooking";
import { immobilienBookingLead, trackGenerateLead } from "../lib/analytics";
import {
  BOOKING_BUNDLES,
  BOOKING_SERVICES,
  INDIVIDUAL_PHOTO_COUNTS,
  PHOTO_PACKAGES,
  PROPERTY_STATUSES,
  getIndividualPhotoLabel,
  getPhotoPackageLabel,
  isBookingBundle,
  isPropertyStatus,
  resolveImmobilienSelection,
  resolvePhotoChoice,
  selectedPhotoLimit,
  todayInputValue,
  type BookingBundle,
  type BookingService,
  type ImmobilienSelection,
  type PropertyStatus,
} from "../lib/booking";
import {
  buildPriceSnapshot,
  bundlePriceItemKey,
  formatEstimatedTotal,
  formatSnapshotLine,
  individualPhotoItemKey,
  loadOwnPriceCatalog,
  optionPriceTexts,
  photoPackageItemKey,
  priceCopy,
  priceNoteLines,
  servicePriceItemKeys,
  type PriceCatalog,
} from "../lib/clientPricing";
import { useDictionary, useLocale } from "../lib/i18n/LocaleProvider";
import { createClient } from "../lib/supabase/client";
import { useAvailableTimes } from "../lib/useAvailableTimes";
import DarkSelect from "./DarkSelect";

const inputClassName =
  "w-full rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED] outline-none transition-colors duration-300 placeholder:text-[#F4F1ED]/40 focus:border-[#F4F1ED]/60";

const choiceClassName =
  "flex cursor-pointer items-center gap-3 rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED] transition-colors duration-300 has-[:checked]:border-[#F4F1ED]/60";

const bundleChoiceClassName =
  "flex cursor-pointer items-start gap-3 rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED] transition-colors duration-300 has-[:checked]:border-[#F4F1ED]/60";

const lockedClassName =
  "flex cursor-default items-start gap-3 rounded-none border border-[#F4F1ED]/50 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED]";

type OfferChoice = "" | "custom" | BookingBundle;

type BookingFormProps = {
  userEmail?: string | null;
  onClose?: () => void;
  onSignedOut?: () => void;
};

export default function BookingForm({ userEmail, onClose, onSignedOut }: BookingFormProps) {
  const { locale } = useLocale();
  const { auth, booking } = useDictionary();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [photoPackage, setPhotoPackage] = useState("");
  const [individualCount, setIndividualCount] = useState("");
  const [offer, setOffer] = useState<OfferChoice>("");
  const [highlightRoom, setHighlightRoom] = useState("");
  const [services, setServices] = useState<BookingService[]>([]);
  const [homestagingCount, setHomestagingCount] = useState(1);
  const [catalog, setCatalog] = useState<PriceCatalog | null>(null);
  const { availableTimes, isCheckingTimes, availabilityMessage } = useAvailableTimes(selectedDate, locale);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    void loadOwnPriceCatalog(supabase).then((result) => {
      if (!active) return;
      setCatalog(result.status === "ready" && result.catalog.items.length > 0 ? result.catalog : null);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    onSignedOut?.();
    setIsSigningOut(false);
  }

  function statusLabel(status: PropertyStatus) {
    return booking.propertyStatuses[status] ?? status;
  }

  function serviceLabel(service: BookingService) {
    return booking.serviceLabels[service] ?? service;
  }

  function selectOffer(next: Exclude<OfferChoice, "">) {
    setOffer(next);
    if (next !== "custom") setIndividualCount("");
    if (next !== "premium-home") setHighlightRoom("");
  }

  function toggleService(service: BookingService) {
    setServices((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service]
    );
  }

  const photoLimit = useMemo(() => {
    if (offer !== "custom") return null;
    const photos = resolvePhotoChoice(
      photoPackage || null,
      individualCount === "" ? null : Number(individualCount)
    );
    return selectedPhotoLimit(photos?.photoPackage ?? null, photos?.individualPhotoCount ?? null);
  }, [offer, photoPackage, individualCount]);

  useEffect(() => {
    if (photoLimit != null && homestagingCount > photoLimit) {
      setHomestagingCount(photoLimit);
    }
  }, [photoLimit, homestagingCount]);

  const priceSnapshot = useMemo(() => {
    if (!catalog) return null;
    const photos =
      offer === "custom"
        ? resolvePhotoChoice(photoPackage || null, individualCount === "" ? null : Number(individualCount))
        : resolvePhotoChoice(photoPackage || null, null);
    const stagedCount =
      offer === "custom" && services.includes("Digital Homestaging") ? homestagingCount : null;
    const selection: ImmobilienSelection = isBookingBundle(offer)
      ? {
          bundle: offer,
          services: [],
          photoPackage: photos?.photoPackage ?? null,
          individualPhotoCount: null,
          highlightRoom: null,
          homestagingPhotoCount: null,
        }
      : {
          bundle: null,
          services: offer === "custom" ? services : [],
          photoPackage: photos?.photoPackage ?? null,
          individualPhotoCount: photos?.individualPhotoCount ?? null,
          highlightRoom: null,
          homestagingPhotoCount: stagedCount,
        };
    return buildPriceSnapshot(catalog, selection);
  }, [catalog, offer, services, photoPackage, individualCount, homestagingCount]);

  function optionLabel(label: string, price: string | null) {
    return price ? `${label} · ${price}` : label;
  }

  function singlePrice(keys: Parameters<typeof optionPriceTexts>[1]) {
    return optionPriceTexts(catalog, keys, locale)[0] ?? null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    if (isCheckingTimes) {
      setErrorMessage(booking.waitAvailability);
      return;
    }

    const requestedTime = String(formData.get("requestedTime") ?? "");
    if (!requestedTime || !availableTimes.includes(requestedTime)) {
      setErrorMessage(availableTimes.length === 0 ? booking.noTimes : booking.selectAvailableTime);
      return;
    }

    const propertyStatus = String(formData.get("propertyStatus") ?? "");
    if (!isPropertyStatus(propertyStatus)) {
      setErrorMessage(booking.selectPropertyStatus);
      return;
    }

    const selection = resolveImmobilienSelection({
      offer,
      services,
      photoPackage: photoPackage || null,
      individualPhotoCount: individualCount === "" ? null : Number(individualCount),
      highlightRoom,
      homestagingPhotoCount: services.includes("Digital Homestaging") ? homestagingCount : null,
    });
    if (!selection.ok) {
      switch (selection.reason) {
        case "offer":
          setErrorMessage(booking.selectOffer);
          return;
        case "services":
          setErrorMessage(booking.selectAtLeastOneService);
          return;
        case "photos":
          setErrorMessage(booking.selectPhotoPackageError);
          return;
        case "bundle-photos":
          setErrorMessage(booking.selectBundlePhotoPackage);
          return;
        case "homestaging":
          setErrorMessage(booking.selectHomestagingCount);
          return;
        default: {
          const neverReason: never = selection.reason;
          setErrorMessage(neverReason);
          return;
        }
      }
    }

    const payload: BookingFormData = {
      locationAddress: String(formData.get("locationAddress") ?? ""),
      requestedDate: String(formData.get("requestedDate") ?? ""),
      requestedTime,
      propertyStatus,
      contactName: String(formData.get("contactName") ?? ""),
      contactNumber: String(formData.get("contactNumber") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      services: selection.selection.services,
      photoPackage: selection.selection.photoPackage,
      individualPhotoCount: selection.selection.individualPhotoCount,
      offer,
      highlightRoom,
      homestagingPhotoCount: selection.selection.homestagingPhotoCount,
      additionalDetails: String(formData.get("additionalDetails") ?? ""),
      locale,
    };

    startTransition(async () => {
      try {
        const result = await submitBooking(payload);
        if (result.success) {
          trackGenerateLead(immobilienBookingLead());
          setIsSuccess(true);
          return;
        }
        setErrorMessage(result.message);
      } catch (error) {
        const message = error instanceof Error ? error.message : booking.error;
        console.error("Booking submission failed:", error);
        setErrorMessage(message);
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">{booking.title}</p>
        <h2 className="mt-4 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">{booking.successTitle}</h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#F4F1ED]/80 sm:text-base">
          {booking.success}
        </p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-8 inline-flex rounded-none border border-gray-800 px-5 py-2.5 text-sm font-semibold text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED]/60"
          >
            {booking.close}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">{booking.realEstateTitle}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">{booking.requestAShoot}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">{booking.realEstateIntro}</p>
      {userEmail ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-gray-800 px-4 py-3">
          <p className="text-xs text-[#F4F1ED]/70">
            {auth.signedInAs} <span className="text-[#F4F1ED]">{userEmail}</span>
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/70 underline-offset-4 hover:text-[#F4F1ED] hover:underline disabled:opacity-60"
          >
            {isSigningOut ? auth.signingOut : auth.signOut}
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="booking-form mt-8 space-y-5">
        <div>
          <label
            htmlFor="locationAddress"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            {booking.locationAddress} *
          </label>
          <input
            id="locationAddress"
            name="locationAddress"
            type="text"
            required
            autoComplete="street-address"
            placeholder={booking.locationPlaceholder}
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="requestedDate"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.selectDate} *
            </label>
            <input
              id="requestedDate"
              name="requestedDate"
              type="date"
              required
              min={todayInputValue()}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className={`${inputClassName} [color-scheme:dark]`}
            />
          </div>
          <div>
            <label
              htmlFor="requestedTime"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.requestedTime} *
            </label>
            <DarkSelect
              id="requestedTime"
              name="requestedTime"
              placeholder={selectedDate ? booking.selectTime : booking.selectDateFirst}
              options={availableTimes.map((time) => ({ value: time, label: time }))}
              disabled={!selectedDate || isCheckingTimes || availableTimes.length === 0}
              loading={isCheckingTimes}
              loadingLabel={booking.checkingAvailability}
              emptyLabel={booking.noTimes}
              resetKey={selectedDate}
            />
            {availabilityMessage && !isCheckingTimes ? (
              <p className="mt-2 text-sm text-[#F4F1ED]/70" role="status">
                {availabilityMessage}
              </p>
            ) : null}
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            {booking.propertyStatus} *
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_STATUSES.map((status) => (
              <label key={status} className={choiceClassName}>
                <input
                  type="radio"
                  name="propertyStatus"
                  value={status}
                  required={status === PROPERTY_STATUSES[0]}
                  className="accent-[#F4F1ED]"
                />
                {statusLabel(status)}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="contactName"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            {booking.contactName} *
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            autoComplete="name"
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contactNumber"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.contactNumber} *
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              required
              autoComplete="tel"
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="contactEmail"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.contactEmail} *
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              autoComplete="email"
              className={inputClassName}
            />
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            {booking.selection} *
          </legend>
          <div className="grid grid-cols-1 gap-2">
            {BOOKING_BUNDLES.map((bundleId) => {
              const bundle = booking.bundles[bundleId];
              const bundlePrice = singlePrice([bundlePriceItemKey(bundleId)]);
              return (
                <label key={bundleId} className={bundleChoiceClassName}>
                  <input
                    type="radio"
                    name="offer"
                    value={bundleId}
                    checked={offer === bundleId}
                    onChange={() => selectOffer(bundleId)}
                    className="mt-1 accent-[#F4F1ED]"
                  />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-medium">{bundle.name}</span>
                      {bundlePrice ? (
                        <span className="ml-auto text-right text-xs font-normal leading-snug text-[#F4F1ED]/70">
                          {bundlePrice}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[#F4F1ED]/75">{bundle.description}</span>
                  </span>
                </label>
              );
            })}
            <label className={bundleChoiceClassName}>
              <input
                type="radio"
                name="offer"
                value="custom"
                checked={offer === "custom"}
                onChange={() => selectOffer("custom")}
                className="mt-1 accent-[#F4F1ED]"
              />
              <span className="min-w-0">
                <span className="block font-medium">{booking.buildYourOwn}</span>
                <span className="mt-1 block text-xs leading-relaxed text-[#F4F1ED]/70">{booking.buildYourOwnHint}</span>
              </span>
            </label>
          </div>
        </fieldset>

        {isBookingBundle(offer) ? (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="photoPackage"
                className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
              >
                {booking.photoPackage} *
              </label>
              <DarkSelect
                id="photoPackage"
                name="photoPackage"
                placeholder={booking.selectPhotoPackage}
                value={photoPackage}
                onChange={setPhotoPackage}
                options={PHOTO_PACKAGES.map((item) => ({
                  value: item.id,
                  label: optionLabel(
                    getPhotoPackageLabel(item.id, locale),
                    singlePrice([photoPackageItemKey(item.id)])
                  ),
                }))}
              />
            </div>
            <ul aria-label={booking.included} className="grid grid-cols-1 gap-2">
              {booking.bundles[offer].inclusions.map((item) => (
                <li key={item} className={lockedClassName}>
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    disabled
                    tabIndex={-1}
                    onChange={() => undefined}
                    className="mt-0.5 accent-[#F4F1ED] disabled:opacity-100"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block leading-snug">{item}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-[#F4F1ED]/55">
                      {booking.included}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {offer === "premium-home" ? (
              <div>
                <label
                  htmlFor="highlightRoom"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                >
                  {booking.highlightRoom}
                </label>
                <input
                  id="highlightRoom"
                  name="highlightRoom"
                  type="text"
                  maxLength={200}
                  value={highlightRoom}
                  onChange={(event) => setHighlightRoom(event.target.value)}
                  placeholder={booking.highlightRoomPlaceholder}
                  className={inputClassName}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {offer === "custom" ? (
          <>
            <fieldset>
              <legend className="mb-3 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
                {booking.selectService} *
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {BOOKING_SERVICES.map((service) => {
                  const priceTexts = optionPriceTexts(catalog, servicePriceItemKeys(service), locale);
                  return (
                    <label key={service} className={choiceClassName}>
                      <input
                        type="checkbox"
                        name="services"
                        value={service}
                        checked={services.includes(service)}
                        onChange={() => toggleService(service)}
                        className="accent-[#F4F1ED]"
                      />
                      {priceTexts.length > 0 ? (
                        <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="leading-snug">{serviceLabel(service)}</span>
                          <span className="ml-auto text-right text-xs leading-snug text-[#F4F1ED]/70">
                            {priceTexts.map((text) => (
                              <span key={text} className="block">
                                {text}
                              </span>
                            ))}
                          </span>
                        </span>
                      ) : (
                        serviceLabel(service)
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
                {booking.photos} *
              </legend>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="photoPackage"
                    className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                  >
                    {booking.photoPackage}
                  </label>
                  <DarkSelect
                    id="photoPackage"
                    name="photoPackage"
                    placeholder={booking.selectPhotoPackage}
                    value={photoPackage}
                    onChange={(next) => {
                      setPhotoPackage(next);
                      if (next) setIndividualCount("");
                    }}
                    options={PHOTO_PACKAGES.map((item) => ({
                      value: item.id,
                      label: optionLabel(
                        getPhotoPackageLabel(item.id, locale),
                        singlePrice([photoPackageItemKey(item.id)])
                      ),
                    }))}
                  />
                </div>
                <div>
                  <label
                    htmlFor="individualPhotos"
                    className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                  >
                    {booking.individualPhotos}
                  </label>
                  <DarkSelect
                    id="individualPhotos"
                    name="individualPhotos"
                    placeholder={booking.selectIndividualPhotos}
                    value={individualCount}
                    onChange={(next) => {
                      setIndividualCount(next);
                      if (next) setPhotoPackage("");
                    }}
                    options={INDIVIDUAL_PHOTO_COUNTS.map((count) => ({
                      value: String(count),
                      label: optionLabel(
                        getIndividualPhotoLabel(count, locale),
                        singlePrice([individualPhotoItemKey()])
                      ),
                    }))}
                  />
                </div>
              </div>
            </fieldset>

            {services.includes("Digital Homestaging") ? (
              <div>
                <label
                  htmlFor="homestagingPhotos"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                >
                  {booking.homestagingPhotos} *
                </label>
                <input
                  id="homestagingPhotos"
                  name="homestagingPhotos"
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  max={photoLimit ?? 50}
                  value={homestagingCount}
                  onChange={(event) => {
                    const raw = event.target.value;
                    if (raw === "") return;
                    const next = Number(raw);
                    if (!Number.isInteger(next)) return;
                    const limit = photoLimit ?? 50;
                    setHomestagingCount(Math.min(limit, Math.max(1, next)));
                  }}
                  className={`${inputClassName} min-w-0 max-w-full [color-scheme:dark]`}
                />
              </div>
            ) : null}
          </>
        ) : null}

        {priceSnapshot ? (
          <div className="border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED]" aria-live="polite">
            <ul className="space-y-2">
              {priceSnapshot.lines.map((line) => (
                <li key={line.itemKey} className="flex items-start justify-between gap-3">
                  <span className="min-w-0 leading-snug">
                    {(locale === "de" ? line.labelDe : line.labelEn) || line.itemKey}
                  </span>
                  <span className="shrink-0 text-right text-xs leading-snug text-[#F4F1ED]/70">
                    {formatSnapshotLine(line, locale)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-start justify-between gap-3 border-t border-gray-800 pt-3">
              <span className="text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
                {priceCopy(locale).estimatedTotal}
              </span>
              <span className="text-right leading-snug">{formatEstimatedTotal(priceSnapshot, locale)}</span>
            </div>
            {priceNoteLines(priceSnapshot, locale).map((line) => (
              <p key={line} className="mt-2 text-xs leading-relaxed text-[#F4F1ED]/60">
                {line}
              </p>
            ))}
          </div>
        ) : null}

        <div>
          <label
            htmlFor="additionalDetails"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            {booking.additionalDetails}
          </label>
          <textarea
            id="additionalDetails"
            name="additionalDetails"
            rows={4}
            maxLength={2000}
            placeholder={booking.additionalPlaceholder}
            className={`${inputClassName} min-h-[7rem] resize-y`}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending || isCheckingTimes || !selectedDate || availableTimes.length === 0}
          className="w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? booking.submitting
            : isCheckingTimes
              ? booking.checkingAvailability
              : booking.confirmBooking}
        </button>
      </form>
    </div>
  );
}
