/* eslint-disable @next/next/no-img-element */
"use client";

import Fieldset from "@/components/fieldset";
import ArrowRightIcon from "@/components/icons/arrow-right";
import LightningBoltIcon from "@/components/icons/lightning-bolt";
import LoadingButton from "@/components/loading-button";
import Spinner from "@/components/spinner";
import bgImg from "@/public/halo.png";
import * as Select from "@radix-ui/react-select";
import assert from "assert";
import { CheckIcon, ChevronDownIcon, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  use,
  useState,
  useRef,
  useTransition,
  useEffect,
  useMemo,
  memo,
} from "react";

import { Context } from "./providers";
import { useS3Upload } from "next-s3-upload";
import UploadIcon from "@/components/icons/upload-icon";
import { MODELS } from "@/lib/constants";

const PROMPT_IDEAS = {
  Social: [
    "Build a private community app for friends with posts, polls, chats, and event planning.",
    "Create a creator collab app with profiles, brand requests, media kits, and campaign tracking.",
    "Make a short-form microlearning app with swipe lessons, streaks, and quizzes.",
    "Build a campus social app with clubs, announcements, group chats, and event RSVPs.",
  ],
  CRM: [
    "Create a CRM for Instagram sellers to track leads, DMs, orders, payments, and follow-ups.",
    "Build a freelancer client portal with proposals, invoices, milestones, files, and payment status.",
    "Make a WhatsApp-first lead manager with stages, reminders, notes, and sales follow-ups.",
    "Create a real estate CRM for listings, buyers, visits, documents, and deal pipelines.",
  ],
  Gaming: [
    "Build a gaming squad finder with skill tags, profiles, invites, and match history.",
    "Create an esports tournament app with brackets, teams, scores, and check-ins.",
    "Make a gamer profile hub for clips, achievements, squads, and social links.",
    "Build a daily gaming challenge app with streaks, badges, and leaderboards.",
  ],
  Automation: [
    "Create a smart home dashboard for rooms, lights, routines, energy usage, and alerts.",
    "Build a home services automation app for tasks, reminders, groceries, and maintenance logs.",
    "Make a workflow tool that automates WhatsApp, email, tasks, and calendar actions.",
    "Create a small office automation hub for device controls, visitors, tickets, and alerts.",
  ],
  Commerce: [
    "Build a mini e-commerce app for a fashion brand with products, cart, coupons, and orders.",
    "Create a QR menu ordering app for restaurants with tables, kitchen view, and payment flow.",
    "Make a creator storefront for digital products, bundles, and customer access.",
    "Build a local services marketplace for bookings, reviews, pricing, and provider management.",
  ],
  Study: [
    "Create an AI study planner with daily tasks, exam timelines, flashcards, and revision reminders.",
    "Build a job tracker for freshers with applications, rounds, notes, and interview reminders.",
    "Make a skill-learning app with progress paths, streaks, projects, and peer reviews.",
    "Create a student productivity app with notes, goals, timetable, and deadline tracking.",
  ],
} as const;

type PromptCategory = keyof typeof PROMPT_IDEAS;

function getRandomPrompt(category: PromptCategory, currentPrompt = "") {
  const prompts = [...PROMPT_IDEAS[category]];
  const filtered = prompts.filter((item) => item !== currentPrompt);
  const pool = filtered.length > 0 ? filtered : prompts;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Home() {
  const { setStreamPromise } = use(Context);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [activeCategory, setActiveCategory] = useState<PromptCategory | null>(
    null,
  );
  const [model, setModel] = useState(
    MODELS.find((m) => !m.hidden)?.value || MODELS[0].value,
  );
  const [quality, setQuality] = useState("low");
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(
    undefined,
  );
  const [screenshotLoading, setScreenshotLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isPending, startTransition] = useTransition();
  const { uploadToS3 } = useS3Upload();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const selectedModel = useMemo(
    () => MODELS.find((m) => m.value === model),
    [model],
  );

  const qualityOptions = useMemo(
    () => [
      { value: "low", label: "Low quality [faster]" },
      { value: "high", label: "High quality [slower]" },
    ],
    [],
  );

  const textareaResizePrompt = useMemo(
    () =>
      prompt
        .split("\n")
        .map((text) => (text === "" ? "a" : text))
        .join("\n"),
    [prompt],
  );

  const focusTextarea = () => {
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        const length = textareaRef.current.value.length;
        textareaRef.current.selectionStart = length;
        textareaRef.current.selectionEnd = length;
      }
    }, 0);
  };

  const loadPromptFromCategory = (category: PromptCategory) => {
    setActiveCategory(category);
    setPrompt(getRandomPrompt(category, prompt));
    focusTextarea();
  };

  const regeneratePrompt = () => {
    if (!activeCategory) return;
    setPrompt(getRandomPrompt(activeCategory, prompt));
    focusTextarea();
  };

  const handleScreenshotUpload = async (event: any) => {
    if (prompt.length === 0) setPrompt("Build this");
    setQuality("low");
    setScreenshotLoading(true);

    const file = event.target.files?.[0];
    if (!file) {
      setScreenshotLoading(false);
      return;
    }

    const { url } = await uploadToS3(file);
    setScreenshotUrl(url);
    setScreenshotLoading(false);
  };

  return (
    <div className="relative flex grow flex-col overflow-hidden">
      <div className="absolute inset-0 flex justify-center">
        <Image
          src={bgImg}
          alt=""
          className="max-h-[953px] w-full max-w-[1200px] object-cover object-top mix-blend-screen"
          priority
        />
      </div>

      <div className="isolate flex h-full grow flex-col">
        <div className="flex grow flex-col items-center px-4 pb-6 pt-8 md:pt-12">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/hyperspeed-logo.svg"
              alt="HyperSpeed"
              className="h-11 w-auto object-contain md:h-12"
            />

            <h1 className="max-w-4xl text-balance text-center text-4xl leading-[0.96] tracking-[-0.04em] text-gray-700 md:text-[64px]">
              What do you want to
              <br className="hidden md:block" /> build today?
            </h1>
          </div>

          <form
            className="relative w-full max-w-2xl pt-8 md:pt-10"
            action={async (formData) => {
              startTransition(async () => {
                const { prompt, model, quality } = Object.fromEntries(formData);

                assert.ok(typeof prompt === "string");
                assert.ok(typeof model === "string");
                assert.ok(quality === "high" || quality === "low");

                const response = await fetch("/api/create-chat", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    prompt,
                    model,
                    quality,
                    screenshotUrl,
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to create chat");
                }

                const { chatId, lastMessageId } = await response.json();

                const streamPromise = fetch(
                  "/api/get-next-completion-stream-promise",
                  {
                    method: "POST",
                    body: JSON.stringify({ messageId: lastMessageId, model }),
                  },
                ).then((res) => {
                  if (!res.body) {
                    throw new Error("No body on response");
                  }
                  return res.body;
                });

                startTransition(() => {
                  setStreamPromise(streamPromise);
                  router.push(`/chats/${chatId}`);
                });
              });
            }}
          >
            <Fieldset>
              <div className="relative flex w-full max-w-2xl rounded-2xl border border-gray-300 bg-white/95 pb-12 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="w-full">
                  {screenshotLoading && (
                    <div className="relative mx-3 mt-3">
                      <div className="rounded-xl">
                        <div className="group mb-2 flex h-16 w-[68px] animate-pulse items-center justify-center rounded bg-gray-200">
                          <Spinner />
                        </div>
                      </div>
                    </div>
                  )}

                  {screenshotUrl && (
                    <div
                      className={`${isPending ? "invisible" : ""} relative mx-3 mt-3`}
                    >
                      <div className="rounded-xl">
                        <img
                          alt="screenshot"
                          src={screenshotUrl}
                          className="group relative mb-2 h-16 w-[68px] rounded object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        id="x-circle-icon"
                        className="absolute -right-3 -top-4 left-14 z-10 size-5 rounded-full bg-white text-gray-900 hover:text-gray-500"
                        onClick={() => {
                          setScreenshotUrl(undefined);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <div className="p-4">
                      <p className="invisible w-full whitespace-pre-wrap text-[15px] leading-6">
                        {textareaResizePrompt}
                      </p>
                    </div>

                    <textarea
                      ref={textareaRef}
                      placeholder="Build me a budgeting app..."
                      required
                      name="prompt"
                      rows={2}
                      className="peer absolute inset-0 w-full resize-none bg-transparent px-4 py-4 text-[15px] leading-6 placeholder-gray-500 focus-visible:outline-none disabled:opacity-50"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        const cleanedText = pastedText
                          .replace(/\r\n/g, "\n")
                          .replace(/\r/g, "\n")
                          .replace(/\n{3,}/g, "\n\n")
                          .trim();

                        const textarea = e.target as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;

                        const newValue =
                          prompt.slice(0, start) +
                          cleanedText +
                          prompt.slice(end);

                        setPrompt(newValue);

                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.selectionStart =
                              start + cleanedText.length;
                            textareaRef.current.selectionEnd =
                              start + cleanedText.length;
                          }
                        }, 0);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          const target = event.target;
                          if (!(target instanceof HTMLTextAreaElement)) return;
                          target.closest("form")?.requestSubmit();
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="absolute bottom-2 left-3 right-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label
                      htmlFor="screenshot"
                      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Attach screenshot"
                      title="Attach screenshot"
                    >
                      <UploadIcon className="size-4" />
                    </label>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />

                    <div className="h-4 w-px bg-gray-200" />

                    <Select.Root
                      name="model"
                      value={model}
                      onValueChange={setModel}
                    >
                      <Select.Trigger className="inline-flex items-center gap-1 rounded-md p-1 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
                        <Select.Value aria-label={model}>
                          <span>{selectedModel?.label}</span>
                        </Select.Value>
                        <Select.Icon>
                          <ChevronDownIcon className="size-3" />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content className="overflow-hidden rounded-md bg-white shadow ring-1 ring-black/5">
                          <Select.Viewport className="space-y-1 p-2">
                            {MODELS.filter((m) => !m.hidden).map((m) => (
                              <Select.Item
                                key={m.value}
                                value={m.value}
                                className="flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none"
                              >
                                <Select.ItemText className="inline-flex items-center gap-2 text-gray-500">
                                  {m.label}
                                </Select.ItemText>
                                <Select.ItemIndicator>
                                  <CheckIcon className="size-3 text-blue-600" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                          <Select.ScrollDownButton />
                          <Select.Arrow />
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    <div className="h-4 w-px bg-gray-200 max-sm:hidden" />

                    <Select.Root
                      name="quality"
                      value={quality}
                      onValueChange={setQuality}
                    >
                      <Select.Trigger className="inline-flex items-center gap-1 rounded-md p-1 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
                        <Select.Value aria-label={quality}>
                          <span className="max-sm:hidden">
                            {quality === "low"
                              ? "Low quality [faster]"
                              : "High quality [slower]"}
                          </span>
                          <span className="sm:hidden">
                            <LightningBoltIcon className="size-3" />
                          </span>
                        </Select.Value>
                        <Select.Icon>
                          <ChevronDownIcon className="size-3" />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content className="overflow-hidden rounded-md bg-white shadow ring-1 ring-black/5">
                          <Select.Viewport className="space-y-1 p-2">
                            {qualityOptions.map((q) => (
                              <Select.Item
                                key={q.value}
                                value={q.value}
                                className="flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none"
                              >
                                <Select.ItemText className="inline-flex items-center gap-2 text-gray-500">
                                  {q.label}
                                </Select.ItemText>
                                <Select.ItemIndicator>
                                  <CheckIcon className="size-3 text-blue-600" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                          <Select.ScrollDownButton />
                          <Select.Arrow />
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div className="relative flex shrink-0 has-[:disabled]:opacity-50">
                    <div className="pointer-events-none absolute inset-0 -bottom-[1px] rounded bg-blue-500" />
                    <LoadingButton
                      className="relative inline-flex size-7 items-center justify-center rounded-md bg-blue-500 font-medium text-white shadow-lg outline-blue-300 hover:bg-blue-500/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-90"
                      type="submit"
                      disabled={screenshotLoading || prompt.length === 0}
                    >
                      <ArrowRightIcon />
                    </LoadingButton>
                  </div>
                </div>

                {isPending && (
                  <LoadingMessage
                    isHighQuality={quality === "high"}
                    screenshotUrl={screenshotUrl}
                  />
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {(Object.keys(PROMPT_IDEAS) as PromptCategory[]).map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => loadPromptFromCategory(category)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeCategory === category
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-white/75 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={regeneratePrompt}
                  disabled={!activeCategory}
                  aria-label="Generate another prompt"
                  title="Generate another prompt"
                  className="inline-flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white/75 text-gray-500 transition hover:border-gray-300 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>
            </Fieldset>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
}

const Footer = memo(() => {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-3 px-5 pb-5 pt-2 text-center text-sm text-gray-500 sm:flex-row">
      <div className="font-medium text-gray-600">
        © {new Date().getFullYear()} HyperSpeed. Build, refine, share.
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>React</span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>shadcn/ui</span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>Sandpack</span>
      </div>
    </footer>
  );
});

function LoadingMessage({
  isHighQuality,
  screenshotUrl,
}: {
  isHighQuality: boolean;
  screenshotUrl: string | undefined;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white px-2 py-3 md:px-3">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
        <span className="animate-pulse text-balance text-center text-sm md:text-base">
          {isHighQuality
            ? "Coming up with project plan, may take 15 seconds..."
            : screenshotUrl
              ? "Analyzing your screenshot..."
              : "Creating your app..."}
        </span>
        <Spinner />
      </div>
    </div>
  );
}

export const runtime = "edge";
export const maxDuration = 60;
