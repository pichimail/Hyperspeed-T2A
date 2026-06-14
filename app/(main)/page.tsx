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
import { CheckIcon, ChevronDownIcon } from "lucide-react";
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
import Header from "@/components/header";
import { useS3Upload } from "next-s3-upload";
import UploadIcon from "@/components/icons/upload-icon";
import { MODELS } from "@/lib/constants";

const HERO_PROMPT_CATEGORIES = {
  Social: [
    "Build a TikTok-style microlearning app with creator profiles, streaks, quizzes, and swipeable lessons.",
    "Create a private friends app for plans, polls, memories, expense splits, and location-based meetups.",
    "Make a creator media kit builder with rate cards, brand deals, analytics, and one-click share links.",
    "Build a short-form community app for local events, reels, comments, creator pages, and moderation.",
  ],
  CRM: [
    "Create a CRM for Instagram sellers to track DMs, leads, orders, payments, and follow-ups.",
    "Build a freelancer client portal with proposals, invoices, milestones, files, and payment status.",
    "Make a WhatsApp-first sales tracker with lead stages, reminders, notes, and daily follow-up lists.",
    "Create a real estate CRM for listings, buyer profiles, site visits, documents, and deal pipelines.",
  ],
  Gaming: [
    "Build a gaming squad finder with skill tags, profiles, voice-room links, match history, and rankings.",
    "Create an esports tournament manager with teams, brackets, check-ins, scores, and prize tracking.",
    "Make a daily challenge game with streaks, leaderboards, unlockable badges, and friend battles.",
    "Build a gamer profile hub for clips, stats, squad invites, socials, and sponsor links.",
  ],
  Automation: [
    "Create a smart home dashboard for lights, rooms, routines, energy usage, and alerts.",
    "Build a family task automation app with chores, reminders, rewards, grocery lists, and shared notes.",
    "Make a small-office control panel for visitors, devices, maintenance requests, and power usage.",
    "Create an automation hub that triggers WhatsApp, email, calendar, and task flows from one dashboard.",
  ],
  Commerce: [
    "Build a mini Shopify-style fashion store with products, carts, coupons, orders, and admin controls.",
    "Create a cloud kitchen ordering app with QR menu, kitchen view, table status, offers, and feedback.",
    "Make a hyperlocal services marketplace for tutors, drivers, repairs, bookings, and reviews.",
    "Build a creator storefront for digital products, paid downloads, bundles, and customer access.",
  ],
  Study: [
    "Create an AI study planner that turns exams into daily tasks, flashcards, and revision reminders.",
    "Build a campus events app with clubs, RSVP, QR check-in, announcements, and group chats.",
    "Make a job tracker for freshers with applications, rounds, notes, reminders, and resume versions.",
    "Create a skill-learning app with roadmaps, projects, streaks, peer reviews, and certificates.",
  ],
} as const;

type HeroPromptCategory = keyof typeof HERO_PROMPT_CATEGORIES;

export default function Home() {
  const { setStreamPromise } = use(Context);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
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
  const [promptCategory, setPromptCategory] =
    useState<HeroPromptCategory>("Social");

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const { uploadToS3 } = useS3Upload();

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

  const activePromptIdeas = useMemo(
    () => HERO_PROMPT_CATEGORIES[promptCategory],
    [promptCategory],
  );

  const usePromptIdea = (description: string) => {
    setPrompt(description);
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }
    }, 0);
  };

  const handleScreenshotUpload = async (event: any) => {
    if (prompt.length === 0) setPrompt("Build this");
    setQuality("low");
    setScreenshotLoading(true);
    let file = event.target.files[0];
    const { url } = await uploadToS3(file);
    setScreenshotUrl(url);
    setScreenshotLoading(false);
  };

  const textareaResizePrompt = useMemo(
    () =>
      prompt
        .split("\n")
        .map((text) => (text === "" ? "a" : text))
        .join("\n"),
    [prompt],
  );

  return (
    <div className="relative flex grow flex-col">
      <div className="absolute inset-0 flex justify-center">
        <Image
          src={bgImg}
          alt=""
          className="max-h-[953px] w-full max-w-[1200px] object-cover object-top mix-blend-screen"
          priority
        />
      </div>

      <div className="isolate flex h-full grow flex-col">
        <Header />

        <div className="mt-10 flex grow flex-col items-center px-4 lg:mt-16">
          <div className="mb-5 inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm backdrop-blur">
            <img src="/hyperspeed-mark.svg" alt="" className="size-4" />
            Prompt-to-app studio
          </div>

          <div className="flex flex-col items-center gap-4">
            <img
              src="/hyperspeed-logo.svg"
              alt="HyperSpeed"
              className="h-12 w-auto object-contain md:h-14"
            />
            <h1 className="text-balance text-center text-4xl leading-none text-gray-700 md:text-[64px] lg:mt-4">
              What do you want to
              <br className="hidden md:block" /> build today?
            </h1>
            <HeroIdeaRotator
              lines={activePromptIdeas}
              onUsePrompt={usePromptIdea}
            />
          </div>

          <form
            className="relative w-full max-w-2xl pt-6 lg:pt-12"
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
              <div className="relative flex w-full max-w-2xl rounded-xl border border-gray-300 bg-white pb-10">
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
                    <div className="p-3">
                      <p className="invisible w-full whitespace-pre-wrap">
                        {textareaResizePrompt}
                      </p>
                    </div>
                    <textarea
                      ref={textareaRef}
                      placeholder="Build me a budgeting app..."
                      required
                      name="prompt"
                      rows={2}
                      className="peer absolute inset-0 w-full resize-none bg-transparent px-4 py-3 placeholder-gray-500 focus-visible:outline-none disabled:opacity-50"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onPaste={(e) => {
                        // Clean up pasted text
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");

                        // Normalize line endings and clean up whitespace
                        const cleanedText = pastedText
                          .replace(/\r\n/g, "\n") // Convert Windows line endings
                          .replace(/\r/g, "\n") // Convert old Mac line endings
                          .replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
                          .trim(); // Remove leading/trailing whitespace

                        // Insert the cleaned text at cursor position
                        const textarea = e.target as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newValue =
                          prompt.slice(0, start) +
                          cleanedText +
                          prompt.slice(end);

                        setPrompt(newValue);

                        // Set cursor position after the pasted text
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
                <div className="absolute bottom-2 left-3 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                      <Select.Trigger className="inline-flex items-center gap-1 rounded p-1 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
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
                    <div className="h-4 w-px bg-gray-200 max-sm:hidden" />
                    <div>
                      <label
                        htmlFor="screenshot"
                        className="flex cursor-pointer gap-2 text-sm text-gray-400 hover:underline"
                      >
                        <div className="flex size-6 items-center justify-center rounded bg-black hover:bg-gray-700">
                          <UploadIcon className="size-4" />
                        </div>
                        <div className="flex items-center justify-center transition hover:text-gray-700">
                          Attach
                        </div>
                      </label>
                      <input
                        // name="screenshot"
                        id="screenshot"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                  </div>

                  <div className="relative flex shrink-0 has-[:disabled]:opacity-50">
                    <div className="pointer-events-none absolute inset-0 -bottom-[1px] rounded bg-blue-500" />

                    <LoadingButton
                      className="relative inline-flex size-6 items-center justify-center rounded bg-blue-500 font-medium text-white shadow-lg outline-blue-300 hover:bg-blue-500/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-90"
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
              <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
                {(
                  Object.keys(HERO_PROMPT_CATEGORIES) as HeroPromptCategory[]
                ).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setPromptCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      promptCategory === category
                        ? "border-blue-200 bg-blue-50 text-blue-600"
                        : "border-gray-200 bg-white/70 text-gray-500 hover:border-gray-300 hover:text-gray-800"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid w-full gap-2 sm:grid-cols-2">
                {activePromptIdeas.slice(0, 4).map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => usePromptIdea(idea)}
                    className="rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-left text-xs leading-relaxed text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-gray-800"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </Fieldset>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function HeroIdeaRotator({
  lines,
  onUsePrompt,
}: {
  lines: readonly string[];
  onUsePrompt: (prompt: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [lines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((current) => (current + 1) % lines.length);
        setVisible(true);
      }, 420);
    }, 3400);

    return () => clearInterval(interval);
  }, [lines.length]);

  const currentLine = lines[index] ?? lines[0] ?? "";

  return (
    <button
      type="button"
      onClick={() => currentLine && onUsePrompt(currentLine)}
      className="group min-h-[3.75rem] max-w-3xl text-balance px-3 text-center text-base leading-relaxed text-gray-500 md:text-xl"
      aria-live="polite"
    >
      <span
        className={`inline-block transition-all duration-500 ease-out ${
          visible
            ? "translate-y-0 opacity-100 blur-0"
            : "translate-y-2 opacity-0 blur-sm"
        }`}
      >
        {currentLine}
      </span>
      <span className="mt-1 block text-xs font-medium text-blue-500 opacity-0 transition group-hover:opacity-100">
        Click to use this prompt
      </span>
    </button>
  );
}

const Footer = memo(() => {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-3 px-5 pb-5 pt-5 text-center text-sm text-gray-500 sm:flex-row sm:pt-2">
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
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white px-1 py-3 md:px-3">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
        <span className="animate-pulse text-balance text-center text-sm md:text-base">
          {isHighQuality
            ? `Coming up with project plan, may take 15 seconds...`
            : screenshotUrl
              ? "Analyzing your screenshot..."
              : `Creating your app...`}
        </span>

        <Spinner />
      </div>
    </div>
  );
}

export const runtime = "edge";
export const maxDuration = 60;
