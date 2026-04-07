import React, { useState } from "react";

function TermsContent({ onAgree, onDisagree, loading = false }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
      <h4>Terms of Use for beDATOS Portal</h4>

      <div style={{ maxHeight: "600px", overflowY: "auto", marginBottom: "15px" }}>
        <p>
          <strong style={{fontSize:"20px"}}>1. Purpose and Permitted Use</strong><br />
          <span style={{fontSize:"16px"}}>
            The beDATOS Online Export and Import Data Portal is made available solely for lawful, authorised,
and bona fide use by registered users in accordance with their subscription plan, account
permissions, and these Terms of Use. Access is granted on a limited, non-exclusive, non-transferable,
and revocable basis, and users may access the Portal only through the designated interface and
approved methods made available by beDATOS. This structure is adapted from the advisory’s
principle that such systems are intended for secure, role-based, interactive access only.
          </span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>2. Prohibited Automated Access and Data Extraction</strong><br />
         <span style={{fontSize:"16px"}}> Users shall not access, query, extract, copy, monitor, harvest, download, or interact with the Portal
or its data through any automated, semi-automated, or non-human means unless expressly
authorised in writing by beDATOS. This includes, without limitation, the use of bots, spiders,
scrapers, crawlers, macros, scripts, browser automation tools, plug-ins, headless browsers,
harvesting utilities, or server-side scripts for data extraction or system interaction. This reflects the
same core restriction set out in the advisory against automated, robotic, or scripted access.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>3. No Bulk Extraction or Unofficial Workarounds</strong><br />
         <span style={{fontSize:"16px"}}> The Portal is designed for secure and controlled access through the normal user interface only. It
shall not be used for bulk extraction, repeated machine-generated hits, mirrored access, systematic
copying, or any unofficial workaround intended to bypass normal interactive use. Any such conduct
may impair system performance, availability, security, and auditability for other users.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>4. No Hacking, Interference, or Unethical Use</strong><br />
         <span style={{fontSize:"16px"}}> Users shall not hack, probe, scan, test, breach, circumvent, interfere with, or disrupt the Portal or
any connected systems. Users shall also not upload or deploy malware, malicious code, automated
attack tools, harmful scripts, or any mechanism designed to impair functionality, overload the
system, bypass technical restrictions, or gain unauthorised access to any account, network,
database, or information.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>5. No Reverse Engineering or Security Bypass</strong><br />
        <span style={{fontSize:"16px"}}> Users shall not reverse engineer, decompile, disassemble, or attempt to derive the source code,
structure, logic, or technical architecture of the Portal, nor shall they attempt to bypass access
controls, session controls, usage restrictions, technical limitations, or security measures
implemented by beDATOS.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>6. No Resale, Redistribution, or Unauthorised Sub-Users</strong><br />
         <span style={{fontSize:"16px"}}> Unless expressly permitted in writing by beDATOS, users shall not resell, sublicense, lease, rent,
assign, distribute, republish, repackage, commercially exploit, or otherwise make available the
Portal, its data, or its outputs to any third party. Users shall also not create unauthorised sub-users,
shared logins, pooled accounts, downstream access arrangements, or any form of indirect
commercial usage of the Portal.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>7. Account Security and Credential Responsibility</strong><br />
        <span style={{fontSize:"16px"}}>  Each user is responsible for maintaining the confidentiality of login credentials and for all activities
carried out through the account. Users shall not share usernames, passwords, OTPs, access tokens,
or session access with any other person, and must immediately notify beDATOS in the event of
suspected unauthorised access, credential compromise, or misuse.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>8. Data Confidentiality and Restricted Use</strong><br />
       <span style={{fontSize:"16px"}}> All data, reports, analytics, records, and information available through the Portal shall be treated as
confidential and used only for lawful and authorised internal purposes. Users shall not disclose,
circulate, publish, sell, transfer, or share such data with any unauthorised person or entity. This is
aligned with the advisory’s emphasis that data accessed through such systems must be used strictly
for authorised purposes and not disclosed outside permitted channels.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>9. Monitoring, Logging, and Audit Rights</strong><br />
         <span style={{fontSize:"16px"}}> beDATOS reserves the right to monitor usage of the Portal for security, compliance, and operational
purposes. The Portal may maintain logs and records including login history, IP addresses, device and
session details, access patterns, query behaviour, download activity, and other technical indicators.
Users acknowledge that any prohibited automated access, scripted usage, scraping activity, or
suspicious conduct may be detected, traced, investigated, and relied upon for enforcement action.
This follows the same principle stated in the advisory that backend access logs can identify the
manner in which data is accessed.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>10. Suspension, Termination, and No Refund</strong><br />
         <span style={{fontSize:"16px"}}>  account found to be in breach of these Terms of Use, including in cases involving scraping, scripting,
hacking, misuse of data, credential sharing, unauthorised sub-user creation, resale, redistribution, or
any other prohibited or unethical practice. In the event of such suspension or termination due to
breach, <strong>no refund shall be payable for any subscription fee, purchase amount, credit balance, or
other payment already made</strong>.</span>
        </p>

        <p>
          <strong style={{fontSize:"20px"}}>11. Investigation and Legal Remedies</strong><br />
         <span style={{fontSize:"16px"}}> In the event of a suspected or actual violation, beDATOS reserves the right to investigate the activity
and take any action it considers appropriate, including issuing warnings, preserving logs and
technical evidence, disabling access, notifying relevant counterparties, and pursuing contractual,
civil, criminal, or injunctive remedies as available under applicable law.</span>
        </p>
      </div>
     <div style={{ marginBottom: "15px" }}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          I have read and agree to the Terms & Conditions
        </label>
      </div>

      {/* ✅ Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={onDisagree}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Denied
        </button>

        <button
          onClick={() => checked && onAgree(checked)}
          disabled={!checked || loading}
          style={{
            padding: "8px 16px",
            background: checked ? "#007bff" : "#999",
            color: "#fff",
            border: "none",
            cursor: checked ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Submitting..." : "Agree"}
        </button>
      </div>
   
    </div>
  );
}

export default TermsContent;