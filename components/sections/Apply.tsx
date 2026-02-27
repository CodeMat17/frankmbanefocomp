"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Send,
  User,
  Users,
  GraduationCap,
  MapPin,
  AlertCircle,
} from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  university: string;
}

interface FormData {
  applicationType: "individual" | "team";
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  university: string;
  country: string;
  program: string;
  yearOfStudy: string;
  teamName: string;
  teamMembers: TeamMember[];
  siteLocation: string;
  conceptBrief: string;
  heardFrom: string;
  agreeEligibility: boolean;
  agreeRequirements: boolean;
  agreeTerms: boolean;
}

const initialForm: FormData = {
  applicationType: "team",
  leadName: "",
  leadEmail: "",
  leadPhone: "",
  university: "",
  country: "",
  program: "B.Arch",
  yearOfStudy: "",
  teamName: "",
  teamMembers: [],
  siteLocation: "",
  conceptBrief: "",
  heardFrom: "",
  agreeEligibility: false,
  agreeRequirements: false,
  agreeTerms: false,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function FieldGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Apply() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [refId, setRefId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTeamMember = () => {
    if (form.teamMembers.length >= 3) return;
    setField("teamMembers", [
      ...form.teamMembers,
      { id: Date.now().toString(), name: "", email: "", university: "" },
    ]);
  };

  const removeTeamMember = (id: string) => {
    setField("teamMembers", form.teamMembers.filter((m) => m.id !== id));
  };

  const updateTeamMember = (id: string, key: keyof Omit<TeamMember, "id">, value: string) => {
    setField(
      "teamMembers",
      form.teamMembers.map((m) => (m.id === id ? { ...m, [key]: value } : m))
    );
  };

  const onHCaptchaChange = (token: string) => setCaptchaToken(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreeEligibility || !form.agreeRequirements || !form.agreeTerms) {
      setErrorMsg("Please confirm all declarations before submitting.");
      return;
    }
    if (!captchaToken) {
      setErrorMsg("Please complete the CAPTCHA verification.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const w3fKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!w3fKey) console.warn("[Web3Forms] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set.");

      // Generate reference ID locally
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let referenceId = "FM2026-";
      for (let i = 0; i < 8; i++) referenceId += chars[Math.floor(Math.random() * chars.length)];

      const teamMembersList =
        form.teamMembers.length > 0
          ? form.teamMembers.map((m) => `${m.name} <${m.email}> — ${m.university}`).join(" | ")
          : "Individual application";
      const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) + " WAT";

      // Build FormData manually from React state (inputs have no name attrs)
      const fd = new FormData();
      fd.append("access_key", w3fKey ?? "");
      fd.append("subject", `[TF2026] New Application — ${form.leadName} (${referenceId})`);
      fd.append("from_name", "Tropical Futures 2026");
      fd.append("replyto", form.leadEmail);
      fd.append("h-captcha-response", captchaToken);
      fd.append("Reference ID", referenceId);
      fd.append("Received", timestamp);
      fd.append("Application Type", form.applicationType);
      fd.append("Lead Name", form.leadName);
      fd.append("Lead Email", form.leadEmail);
      fd.append("Phone", form.leadPhone || "—");
      fd.append("University", form.university);
      fd.append("Country", form.country);
      fd.append("Program", form.program);
      fd.append("Year of Study", form.yearOfStudy);
      fd.append("Team Name", form.teamName || "—");
      fd.append("Team Members", teamMembersList);
      fd.append("Site Location", form.siteLocation);
      fd.append("Concept Brief", form.conceptBrief || "—");
      fd.append("Heard From", form.heardFrom || "—");

      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Submission failed.");

      captchaRef.current?.resetCaptcha();
      setCaptchaToken("");
      setRefId(referenceId);
      setDialogOpen(true);
    } catch (err) {
      captchaRef.current?.resetCaptcha();
      setCaptchaToken("");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section id='apply' className='py-24 md:py-32 bg-muted/40 overflow-hidden'>
      <div className='container-max section-padding'>
        <motion.div
          ref={ref}
          className='grid lg:grid-cols-5 gap-12 items-start'
          initial='hidden'
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Left sidebar info */}
          <motion.div className='lg:col-span-2 space-y-6' variants={fadeUp}>
            <div>
              <span className='text-sm font-bold uppercase tracking-widest text-primary block mb-3'>
                Step 1 of 2
              </span>
              <h2 className='text-4xl sm:text-5xl font-black text-foreground mb-4 leading-tight'>
                Apply to Compete
              </h2>
              <p className='text-muted-foreground leading-relaxed'>
                Register your interest. Selected applicants will receive a
                unique submission code to upload their design work before the
                July 31 deadline.
              </p>
            </div>

            {/* Registration fees */}
            <div className='space-y-3'>
              <p className='text-sm font-bold text-foreground'>
                Registration Fees
              </p>
              <div className='p-4 rounded-xl border border-border bg-card'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-semibold text-foreground'>
                    Early Bird
                  </span>
                  <span className='font-black text-primary'>₦10,000</span>
                </div>
                <div className='text-xs text-muted-foreground'>
                  Until April 15, 2026
                </div>
              </div>
              <div className='p-4 rounded-xl border border-border bg-card'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-semibold text-foreground'>
                    Standard
                  </span>
                  <span className='font-black text-foreground'>₦25,000</span>
                </div>
                <div className='text-xs text-muted-foreground'>
                  April 16 – May 15, 2026
                </div>
              </div>
            </div>

            <div className='p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground'>
              <strong className='text-foreground block mb-1'>
                After registration:
              </strong>
              The organizing team will review your application. Eligible
              candidates will be contacted with a secure submission code via
              email before the submission window opens.
            </div>
          </motion.div>

          {/* Form */}
          <motion.div className='lg:col-span-3' variants={fadeUp}>
            <motion.form
              onSubmit={handleSubmit}
              className='bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 space-y-8'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}>
              {/* Application type */}
              <FieldGroup title='Application Type'>
                <div className='grid grid-cols-2 gap-3'>
                  {(["individual", "team"] as const).map((type) => (
                    <button
                      type='button'
                      key={type}
                      onClick={() => setField("applicationType", type)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        form.applicationType === type
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}>
                      {type === "individual" ? (
                        <User className='w-5 h-5 shrink-0' />
                      ) : (
                        <Users className='w-5 h-5 shrink-0' />
                      )}
                      <span className='font-semibold capitalize'>{type}</span>
                    </button>
                  ))}
                </div>
                {form.applicationType === "team" && (
                  <div>
                    <Label htmlFor='teamName'>Team Name</Label>
                    <Input
                      id='teamName'
                      placeholder='e.g. Studio Tropics'
                      value={form.teamName}
                      onChange={(e) => setField("teamName", e.target.value)}
                      className='mt-1.5'
                    />
                  </div>
                )}
              </FieldGroup>

              {/* Lead applicant */}
              <FieldGroup title='Lead Applicant'>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='leadName'>Full Name *</Label>
                    <Input
                      id='leadName'
                      required
                      placeholder='Jane Okonkwo'
                      value={form.leadName}
                      onChange={(e) => setField("leadName", e.target.value)}
                      className='mt-1.5'
                    />
                  </div>
                  <div>
                    <Label htmlFor='leadEmail'>Email Address *</Label>
                    <Input
                      id='leadEmail'
                      type='email'
                      required
                      placeholder='jane@university.edu'
                      value={form.leadEmail}
                      onChange={(e) => setField("leadEmail", e.target.value)}
                      className='mt-1.5'
                    />
                  </div>
                </div>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='leadPhone'>
                      Phone (WhatsApp preferred)
                    </Label>
                    <Input
                      id='leadPhone'
                      placeholder='+234 800 000 0000'
                      value={form.leadPhone}
                      onChange={(e) => setField("leadPhone", e.target.value)}
                      className='mt-1.5'
                    />
                  </div>
                  <div>
                    <Label htmlFor='country'>Country *</Label>
                    <Input
                      id='country'
                      required
                      placeholder='Nigeria'
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                      className='mt-1.5'
                    />
                  </div>
                </div>
              </FieldGroup>

              {/* Academic */}
              <FieldGroup title='Academic Information'>
                <div>
                  <Label htmlFor='university'>University / Institution *</Label>
                  <Input
                    id='university'
                    required
                    placeholder='University of Lagos'
                    value={form.university}
                    onChange={(e) => setField("university", e.target.value)}
                    className='mt-1.5'
                  />
                </div>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div>
                    <Label>Program *</Label>
                    <Select
                      required
                      value={form.program}
                      onValueChange={(v) => setField("program", v)}>
                      <SelectTrigger className='mt-1.5 w-full'>
                        <SelectValue placeholder='Select program' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='B.Arch'>
                          B.Arch (Architecture)
                        </SelectItem>
                        <SelectItem value='M.Arch'>
                          M.Arch (Architecture)
                        </SelectItem>
                        <SelectItem value='B.Eng'>
                          B.Eng / B.Tech (Engineering)
                        </SelectItem>
                        <SelectItem value='Other'>
                          Other (specify in brief)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Year of Study *</Label>
                    <Select
                      required
                      value={form.yearOfStudy}
                      onValueChange={(v) => setField("yearOfStudy", v)}>
                      <SelectTrigger className='mt-1.5 w-full'>
                        <SelectValue placeholder='Select year' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1st Year'>
                          1st Year
                        </SelectItem>
                        <SelectItem value='2nd Year'>
                          2nd Year
                        </SelectItem>
                        <SelectItem value='3rd Year'>3rd Year</SelectItem>
                        <SelectItem value='4th Year'>4th Year</SelectItem>
                        <SelectItem value='5th Year'>5th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FieldGroup>

              {/* Team members */}
              {form.applicationType === "team" && (
                <FieldGroup
                  title={`Additional Team Members (${form.teamMembers.length}/3)`}>
                  <AnimatePresence>
                    {form.teamMembers.map((member, i) => (
                      <motion.div
                        key={member.id}
                        className='relative p-4 rounded-xl border border-border bg-muted/30'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}>
                        <div className='flex items-center justify-between mb-3'>
                          <span className='text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1'>
                            <GraduationCap className='w-3.5 h-3.5' />
                            Member {i + 2}
                          </span>
                          <button
                            type='button'
                            onClick={() => removeTeamMember(member.id)}
                            className='text-muted-foreground hover:text-destructive transition-colors'>
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                        <div className='grid sm:grid-cols-2 gap-3'>
                          <Input
                            placeholder='Full Name'
                            value={member.name}
                            onChange={(e) =>
                              updateTeamMember(
                                member.id,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder='Email'
                            type='email'
                            value={member.email}
                            onChange={(e) =>
                              updateTeamMember(
                                member.id,
                                "email",
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder='University'
                            className='sm:col-span-2'
                            value={member.university}
                            onChange={(e) =>
                              updateTeamMember(
                                member.id,
                                "university",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {form.teamMembers.length < 3 && (
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full border-dashed'
                      onClick={addTeamMember}>
                      <Plus className='w-4 h-4 mr-2' />
                      Add Team Member
                    </Button>
                  )}
                </FieldGroup>
              )}

              {/* Site & brief */}
              <FieldGroup title='Site & Concept'>
                <div>
                  <Label htmlFor='siteLocation'>
                    <MapPin className='w-3.5 h-3.5' />
                    Proposed Site Location *
                  </Label>
                  <Input
                    id='siteLocation'
                    required
                    placeholder='e.g. Enugu, Enugu State, Nigeria'
                    value={form.siteLocation}
                    onChange={(e) => setField("siteLocation", e.target.value)}
                    className='mt-1.5'
                  />
                </div>
                <div>
                  <Label htmlFor='conceptBrief'>
                    Initial Concept Brief
                    <span className='text-muted-foreground font-normal ml-1'>
                      (optional, max 100 words)
                    </span>
                  </Label>
                  <Textarea
                    id='conceptBrief'
                    placeholder='Briefly describe your initial design direction or the cultural tradition you intend to explore...'
                    value={form.conceptBrief}
                    onChange={(e) => setField("conceptBrief", e.target.value)}
                    className='mt-1.5 min-h-[90px]'
                    maxLength={600}
                  />
                </div>
                <div>
                  <Label htmlFor='heardFrom'>
                    How did you hear about this competition?
                  </Label>
                  <Input
                    id='heardFrom'
                    placeholder='e.g. University notice board, social media, professor...'
                    value={form.heardFrom}
                    onChange={(e) => setField("heardFrom", e.target.value)}
                    className='mt-1.5'
                  />
                </div>
              </FieldGroup>

              {/* Declarations */}
              <FieldGroup title='Declarations'>
                {[
                  {
                    key: "agreeEligibility" as const,
                    label:
                      "I confirm that all team members are currently enrolled in an eligible program (B.Arch 3rd year+ or M.Arch).",
                  },
                  {
                    key: "agreeRequirements" as const,
                    label:
                      "I understand the submission requirements and that work must be original and student-driven.",
                  },
                  {
                    key: "agreeTerms" as const,
                    label:
                      "I agree to the competition terms & conditions, including that the jury's decision is final and IP remains with authors.",
                  },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className='flex items-start gap-3 cursor-pointer group'>
                    <div className='relative mt-0.5'>
                      <input
                        type='checkbox'
                        className='sr-only'
                        checked={form[key] as boolean}
                        onChange={(e) => setField(key, e.target.checked)}
                      />
                      <motion.div
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                          form[key]
                            ? "border-primary bg-primary"
                            : "border-border group-hover:border-primary/50"
                        }`}
                        whileTap={{ scale: 0.9 }}>
                        {form[key] && (
                          <CheckCircle2 className='w-3 h-3 text-primary-foreground' />
                        )}
                      </motion.div>
                    </div>
                    <span className='text-sm text-muted-foreground leading-relaxed'>
                      {label}
                    </span>
                  </label>
                ))}
              </FieldGroup>

              {/* Error */}
              <AnimatePresence>
                {(status === "error" || errorMsg) && (
                  <motion.div
                    className='flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive'
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}>
                    <AlertCircle className='w-4 h-4 shrink-0 mt-0.5' />
                    {errorMsg || "Something went wrong. Please try again."}
                  </motion.div>
                )}
              </AnimatePresence>

              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_WEB3FORMS_SITE_KEY!}
                reCaptchaCompat={false}
                onVerify={onHCaptchaChange}
                onExpire={() => setCaptchaToken("")}
                ref={captchaRef}
              />

              {/* Submit */}
              <Button
                type='submit'
                size='lg'
                className='w-full h-12 text-base font-bold'
                disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className='w-4 h-4 mr-2' />
                    Submit Application
                  </>
                )}
              </Button>

              <p className='text-xs text-center text-muted-foreground'>
                Registration to the competition website:{" "}
                <a
                  href='https://gouni.edu.ng/tropicalfutures2026/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary underline underline-offset-2'>
                  gouni.edu.ng/tropicalfutures2026
                </a>
              </p>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>

      {/* Success modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-md text-center'>
          <DialogHeader className='items-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <CheckCircle2 className='w-16 h-16 text-primary mx-auto mb-2' />
            </motion.div>
            <DialogTitle className='text-2xl font-black'>
              Application Submitted!
            </DialogTitle>
            <DialogDescription className='text-base text-muted-foreground'>
              Your application has been received by the organizing team.
            </DialogDescription>
          </DialogHeader>

          <div className='py-2'>
            <p className='text-sm text-muted-foreground mb-1'>
              Your Reference ID
            </p>
            <p className='text-xl font-mono font-bold text-foreground tracking-wider bg-muted rounded-lg py-2 px-4 inline-block'>
              {refId}
            </p>
            <p className='text-sm text-muted-foreground mt-4'>
              Save this ID. The organizing team will review your eligibility and if you make it, your unique reference ID will be needed to submit your work when the submission window opens.
            </p>
          </div>

          <DialogFooter className='justify-center sm:justify-center'>
            <Button
              className='w-full sm:w-auto'
              onClick={() => setDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
