"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Send,
  ShieldCheck,
  Link,
  Copy,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SubmitFormData {
  code: string;
  teamName: string;
  projectTitle: string;
  applicationRef: string;
  leadEmail: string;
  siteLocation: string;
  wordCountConfirmed: boolean;
  declarationsAgreed: boolean;
  aiDisclosure: boolean;
  pdfUrl: string;
}

const initialSubmit: SubmitFormData = {
  code: "",
  teamName: "",
  projectTitle: "",
  applicationRef: "",
  leadEmail: "",
  siteLocation: "",
  wordCountConfirmed: false,
  declarationsAgreed: false,
  aiDisclosure: false,
  pdfUrl: "",
};

export default function Submit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const [form, setForm] = useState<SubmitFormData>(initialSubmit);
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [urlWarning, setUrlWarning] = useState(false);
  const [copied, setCopied] = useState(false);

  const setField = <K extends keyof SubmitFormData>(key: K, value: SubmitFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const verifyCode = async () => {
    if (!form.code.trim()) return;
    setCodeStatus("checking");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setCodeStatus("valid");
        setField("applicationRef", form.code.trim());
      } else {
        setCodeStatus("invalid");
      }
    } catch {
      setCodeStatus("invalid");
    }
  };

  const handlePdfUrlChange = (value: string) => {
    setField("pdfUrl", value);
    if (value && !value.includes("drive.google.com")) {
      setUrlWarning(true);
    } else {
      setUrlWarning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pdfUrl.trim()) {
      setErrorMsg("Please paste your Google Drive link.");
      return;
    }
    if (form.applicationRef.trim().toUpperCase() !== form.code.trim().toUpperCase()) {
      setErrorMsg("Application Reference ID does not match your submission code. Please check and correct it.");
      return;
    }
    if (!form.wordCountConfirmed || !form.declarationsAgreed) {
      setErrorMsg("Please confirm all declarations.");
      return;
    }

    setSubmitStatus("sending");
    setErrorMsg("");

    try {
      // Validate server-side (code re-verification + generate confirmation ID)
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          teamName: form.teamName,
          projectTitle: form.projectTitle,
          applicationRef: form.applicationRef,
          leadEmail: form.leadEmail,
          siteLocation: form.siteLocation,
          pdfUrl: form.pdfUrl,
          aiDisclosure: form.aiDisclosure,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed.");

      const id = data.confirmationId || "TF2026-XXXXXXXX";
      setConfirmationId(id);

      // Notify via Web3Forms from the browser (free tier requires client-side calls)
      const w3fKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!w3fKey) {
        console.warn("[Web3Forms] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — notification skipped.");
      } else {
        const timestamp =
          new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) + " WAT";
        const fd = new FormData();
        fd.append("access_key", w3fKey);
        fd.append("subject", `[TF2026 SUBMISSION] ${form.teamName} — "${form.projectTitle}" (${id})`);
        fd.append("from_name", "Tropical Futures 2026");
        fd.append("replyto", form.leadEmail);
        fd.append("Confirmation ID", id);
        fd.append("Received", timestamp);
        fd.append("Submission Code", form.code);
        fd.append("Team / Applicant", form.teamName);
        fd.append("Project Title", form.projectTitle);
        fd.append("Application Ref", form.applicationRef);
        fd.append("Lead Email", form.leadEmail);
        fd.append("Site Location", form.siteLocation);
        fd.append("PDF / Drive Link", form.pdfUrl);
        fd.append("AI Disclosure", form.aiDisclosure ? "Yes — disclosed in submission" : "No AI content declared");
        fetch("https://api.web3forms.com/submit", { method: "POST", body: fd })
          .catch((err) => console.warn("[Web3Forms]", err));
      }

      setSubmitStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setSubmitStatus("error");
    }
  };

  return (
    <section id="submit" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container-max section-padding">
        <motion.div
          ref={ref}
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">
              Step 2 of 2
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
              Submit Your Work
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Only applicants who have been selected and received a unique submission code
              may submit their final PDF portfolio link.
            </p>
          </div>

          {/* Success modal */}
          <Dialog
            open={submitStatus === "success"}
            onOpenChange={(open) => {
              if (!open) {
                setForm(initialSubmit);
                setCodeStatus("idle");
                setSubmitStatus("idle");
                setConfirmationId("");
                setCopied(false);
              }
            }}
          >
            <DialogContent showCloseButton={false} className="sm:max-w-md text-center">
              <DialogHeader className="items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                >
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </motion.div>
                <DialogTitle className="text-2xl font-black">Submission Received!</DialogTitle>
                <DialogDescription className="text-base">
                  Your entry has been securely logged. Good luck!
                </DialogDescription>
              </DialogHeader>

              {/* Confirmation ID */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Confirmation ID
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl font-black font-mono text-foreground tracking-wide">
                    {confirmationId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(confirmationId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Copy confirmation ID"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-4 h-4 text-primary" />
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Copy className="w-4 h-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Save this ID for your records.</p>
              </div>

              <DialogFooter className="sm:justify-center">
                <Button
                  className="w-full sm:w-auto px-10"
                  onClick={() => {
                    setForm(initialSubmit);
                    setCodeStatus("idle");
                    setSubmitStatus("idle");
                    setConfirmationId("");
                    setCopied(false);
                  }}
                >
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                {/* Code verification card */}
                <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <AnimatePresence mode="wait">
                      {codeStatus === "valid" ? (
                        <motion.div key="unlock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Unlock className="w-5 h-5 text-primary" />
                        </motion.div>
                      ) : (
                        <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <h3 className="font-bold text-foreground">
                      {codeStatus === "valid" ? "Access Granted" : "Enter Your Submission Code"}
                    </h3>
                    {codeStatus === "valid" && (
                      <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        Verified
                      </span>
                    )}
                  </div>

                  {codeStatus !== "valid" && (
                    <div className="flex gap-2">
                      <motion.div
                        animate={codeStatus === "invalid" ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="flex-1"
                      >
                        <Input
                          placeholder="Enter your unique submission code (e.g. TF2026-XXXXXXXX)"
                          value={form.code}
                          onChange={(e) => {
                            setField("code", e.target.value);
                            if (codeStatus === "invalid") setCodeStatus("idle");
                          }}
                          className={codeStatus === "invalid" ? "border-destructive" : ""}
                          onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                        />
                      </motion.div>
                      <Button
                        onClick={verifyCode}
                        disabled={codeStatus === "checking" || !form.code.trim()}
                        className="shrink-0"
                      >
                        {codeStatus === "checking" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  )}

                  <AnimatePresence>
                    {codeStatus === "invalid" && (
                      <motion.p
                        className="mt-2 text-xs text-destructive flex items-center gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle className="w-3 h-3" />
                        Invalid code. You may not have been selected for this stage of the competition or contact dicom@gouni.edu.ng
                      </motion.p>
                    )}
                    {codeStatus === "valid" && (
                      <motion.p
                        className="mt-2 text-xs text-primary flex items-center gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Code verified. Complete the form below to submit your work.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submission form — shown only after code is verified */}
                <AnimatePresence>
                  {codeStatus === "valid" && (
                    <motion.form
                      onSubmit={handleSubmit}
                      className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm space-y-8"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Submission details */}
                      <div className="space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                          Submission Details
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="teamName">Team / Applicant Name *</Label>
                            <Input
                              id="teamName"
                              required
                              placeholder="Studio Tropics"
                              value={form.teamName}
                              onChange={(e) => setField("teamName", e.target.value)}
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="projectTitle">Project Title *</Label>
                            <Input
                              id="projectTitle"
                              required
                              placeholder="The Living Archive"
                              value={form.projectTitle}
                              onChange={(e) => setField("projectTitle", e.target.value)}
                              className="mt-1.5"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="applicationRef">Application Reference ID *</Label>
                            <Input
                              id="applicationRef"
                              required
                              placeholder="Auto-filled from your submission code"
                              value={form.applicationRef}
                              readOnly
                              className="mt-1.5 bg-muted/50 text-muted-foreground cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <Label htmlFor="leadEmail">Lead Applicant Email *</Label>
                            <Input
                              id="leadEmail"
                              type="email"
                              required
                              placeholder="jane@university.edu"
                              value={form.leadEmail}
                              onChange={(e) => setField("leadEmail", e.target.value)}
                              className="mt-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="siteLocation">Site Location *</Label>
                          <Input
                            id="siteLocation"
                            required
                            placeholder="e.g. Enugu, Enugu State, Nigeria"
                            value={form.siteLocation}
                            onChange={(e) => setField("siteLocation", e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      {/* Google Drive PDF link */}
                      <div className="space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                          PDF Portfolio Link
                        </div>

                        {/* Critical sharing warning */}
                        <div className="rounded-xl border border-amber-400/60 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                              You must share your PDF via Google Drive before submitting
                            </p>
                          </div>
                          <ol className="space-y-1.5 text-sm text-amber-800 dark:text-amber-300 list-none">
                            {[
                              "Upload your PDF to Google Drive",
                              "Right-click the file → Share",
                              'Under "General access", select "Anyone with the link"',
                              "Set role to Viewer, then click Copy link",
                              "Paste the link in the field below",
                            ].map((step, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="font-black text-amber-600 dark:text-amber-400 shrink-0 leading-tight">
                                  {i + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 border-t border-amber-300/50 dark:border-amber-700/50 pt-2">
                            If the jury cannot open your link, your entry cannot be judged. Please verify access before submitting.
                          </p>
                        </div>

                        {/* URL input */}
                        <div>
                          <Label htmlFor="pdfUrl">Google Drive Link *</Label>
                          <div className="relative mt-1.5">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <Input
                              id="pdfUrl"
                              required
                              placeholder="https://drive.google.com/file/d/..."
                              value={form.pdfUrl}
                              onChange={(e) => handlePdfUrlChange(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          <AnimatePresence>
                            {urlWarning && (
                              <motion.p
                                className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                              >
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                This doesn&apos;t look like a Google Drive link. Please double-check.
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Declarations */}
                      <div className="space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                          Declarations
                        </div>

                        {[
                          {
                            key: "wordCountConfirmed" as const,
                            label: "I confirm the project summary does not exceed 300 words, and all boards are A1 landscape format.",
                          },
                          {
                            key: "declarationsAgreed" as const,
                            label: "All submitted work is original and student-driven. No participant names or school insignia appear on the boards (blind review).",
                          },
                          {
                            key: "aiDisclosure" as const,
                            label: "Any use of AI-generated content has been clearly disclosed within the submission with a statement of critical authorship.",
                          },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={form[key] as boolean}
                                onChange={(e) => setField(key, e.target.checked)}
                              />
                              <motion.div
                                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                                  form[key]
                                    ? "border-primary bg-primary"
                                    : "border-border group-hover:border-primary/50"
                                }`}
                                whileTap={{ scale: 0.9 }}
                              >
                                {form[key] && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                              </motion.div>
                            </div>
                            <span className="text-sm text-muted-foreground leading-relaxed">{label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {(submitStatus === "error" || errorMsg) && (
                          <motion.div
                            className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            {errorMsg}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Status */}
                      {submitStatus === "sending" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending submission...
                        </div>
                      )}

                      {/* Submit */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-base font-bold"
                        disabled={submitStatus === "sending"}
                      >
                        {submitStatus === "sending" ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                        ) : (
                          <><Send className="w-4 h-4 mr-2" /> Submit Final Entry</>
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Deadline: <strong className="text-foreground">July 31, 2026 at 23:59 WAT</strong>.
                        No late submissions will be accepted.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Info for non-selected candidates */}
                {codeStatus !== "valid" && (
                  <motion.div
                    className="mt-6 p-5 rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="font-semibold text-foreground mb-1">Don&apos;t have a code yet?</p>
                    <p>
                      Submission codes are issued exclusively to approved applicants after the
                      registration review process. If you have applied and not yet received your
                      code, please contact{" "}
                      <a href="mailto:dicom@gouni.edu.ng" className="text-primary underline underline-offset-2">
                        dicom@gouni.edu.ng
                      </a>
                      .
                    </p>
                  </motion.div>
                )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
