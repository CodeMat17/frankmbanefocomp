"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Unlock,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  Send,
  ShieldCheck,
} from "lucide-react";

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
  pdfFile: File | null;
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
  pdfFile: null,
};

export default function Submit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<SubmitFormData>(initialSubmit);
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "uploading" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [dragOver, setDragOver] = useState(false);

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
      setCodeStatus(data.valid ? "valid" : "invalid");
    } catch {
      setCodeStatus("invalid");
    }
  };

  const handleFileDrop = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      setErrorMsg("Please upload a PDF file only.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("File size must not exceed 20 MB.");
      return;
    }
    setErrorMsg("");
    setField("pdfFile", file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileDrop(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pdfFile) { setErrorMsg("Please upload your PDF submission."); return; }
    if (!form.wordCountConfirmed || !form.declarationsAgreed) {
      setErrorMsg("Please confirm all declarations.");
      return;
    }

    setSubmitStatus("uploading");
    setErrorMsg("");

    try {
      // Step 1: Upload PDF to Cloudinary (direct unsigned upload)
      let pdfUrl = "";
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (cloudName && uploadPreset) {
        const cloudData = new FormData();
        cloudData.append("file", form.pdfFile);
        cloudData.append("upload_preset", uploadPreset);
        cloudData.append("resource_type", "raw");
        cloudData.append("folder", "tropical-futures-2026");
        cloudData.append("public_id", `${form.code}_${form.projectTitle.replace(/\s+/g, "-")}`);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
          { method: "POST", body: cloudData }
        );
        if (!cloudRes.ok) throw new Error("File upload failed. Please try again.");
        const cloudResult = await cloudRes.json();
        pdfUrl = cloudResult.secure_url;
      } else {
        // Dev mode: continue without actual upload
        pdfUrl = `[DEV MODE — File: ${form.pdfFile.name}]`;
      }

      setSubmitStatus("sending");

      // Step 2: Notify via API
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
          pdfUrl,
          fileName: form.pdfFile.name,
          fileSize: form.pdfFile.size,
          aiDisclosure: form.aiDisclosure,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed.");
      setConfirmationId(data.confirmationId || "TF2026-XXXXXXXX");
      setSubmitStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setSubmitStatus("error");
    }
  };

  return (
    <section id="submit" className="py-24 md:py-32 bg-background">
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
              may upload their final PDF portfolio.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Success state */}
            {submitStatus === "success" ? (
              <motion.div
                className="text-center py-16 px-8 rounded-2xl border border-primary/30 bg-primary/5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key="success"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-black text-foreground mb-2">Submission Received!</h3>
                <p className="text-muted-foreground mb-4">
                  Confirmation ID:{" "}
                  <strong className="text-foreground font-mono">{confirmationId}</strong>
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Your submission has been securely received. The organizing team will acknowledge
                  receipt within 48 hours. Good luck!
                </p>
              </motion.div>
            ) : (
              <motion.div key="main" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                {/* Code verification card */}
                <motion.div
                  className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm"
                  layout
                >
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
                        Invalid code. Please check your email or contact info@gouni.edu.ng
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
                </motion.div>

                {/* Submission form — shown only after code is verified */}
                <AnimatePresence>
                  {codeStatus === "valid" && (
                    <motion.form
                      onSubmit={handleSubmit}
                      className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8"
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
                              placeholder="FM2026-XXXX"
                              value={form.applicationRef}
                              onChange={(e) => setField("applicationRef", e.target.value)}
                              className="mt-1.5"
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

                      {/* PDF upload */}
                      <div className="space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                          PDF Portfolio Upload
                        </div>

                        {form.pdfFile ? (
                          <motion.div
                            className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <FileText className="w-8 h-8 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground text-sm truncate">{form.pdfFile.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {(form.pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setField("pdfFile", null)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ) : (
                          <div
                            className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                              dragOver
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileDrop(file);
                              }}
                            />
                            <Upload className={`w-8 h-8 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="text-center">
                              <p className="text-sm font-semibold text-foreground">
                                Drop your PDF here or click to browse
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF only · Max 20 MB · 3 A1 boards + optional renders
                              </p>
                            </div>
                          </div>
                        )}
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
                      {(submitStatus === "uploading" || submitStatus === "sending") && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {submitStatus === "uploading" ? "Uploading PDF securely..." : "Sending submission..."}
                        </div>
                      )}

                      {/* Submit */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-base font-bold"
                        disabled={submitStatus === "uploading" || submitStatus === "sending"}
                      >
                        {submitStatus === "uploading" || submitStatus === "sending" ? (
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
                      <a href="mailto:info@gouni.edu.ng" className="text-primary underline underline-offset-2">
                        info@gouni.edu.ng
                      </a>
                      .
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
