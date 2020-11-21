import React, { useState } from "react";
import Modal from "./Modal";

export default function Footer() {
  const [termsModalOpen, setTermsModal] = useState(false);
  const [policyModalOpen, setPolicyModal] = useState(false);
  const [supportModalOpen, setSupportModal] = useState(false);
  return (
    <>
      <footer className="b-tertiary c-white">
        <div className="left">
          <a
            className="hoverfx"
            data-text="Terms of Usage"
            onClick={() => setTermsModal(true)}
          >
            Terms of Usage
          </a>
          <a
            onClick={() => setPolicyModal(true)}
            className="hoverfx"
            data-text="Privacy Policy"
          >
            Privacy Policy
          </a>
          <a
            className="hoverfx"
            data-text="Help & Support"
            onClick={() => setSupportModal(true)}
          >
            Help & Support
          </a>
        </div>
        <div>Copyright &copy; 2020 gripURL</div>
      </footer>
      <Modal
        title="Help & Support"
        isOpen={supportModalOpen}
        close={() => setSupportModal(false)}
      >
        <div className="support">
          <p className="c-tertiary">
            The following email can be used to report bugs, issues, or simply to
            comminute with us:
          </p>
          <p className="c-primary direct text-center mt-2">
            <a
              href="mailto:support@gridurl.com"
              className="hoverfx"
              data-text="support@gridurl.com"
            >
              support@gridurl.com
            </a>
          </p>
        </div>
      </Modal>
      <Modal
        title="Terms of Usage"
        isOpen={termsModalOpen}
        close={() => setTermsModal(false)}
      >
        <div className="terms">
          <p className="direct c-tertiary">
            To use this app, you must abide by the following terms:
          </p>

          <div className="list c-primary">
            <p className="list-item">
              Do not advertise gripURL.com links directly on any form of traffic
              exchange / PTC website.
            </p>
            <p className="list-item">
              Do not place gripURL.com links anywhere that may contain adult or
              illegal material (including advertising).
            </p>
            <p className="list-item">
              Do not shrink any website URLs that contain adult or illegal
              material.
            </p>
            <p className="list-item">
              Do not create 'redirect loops' with similar services (or
              gripURL.com) to generate revenue.
            </p>
            <p className="list-item">
              Do not create spam with gripURL.com links anywhere, including
              forums / chat / comments / blogs.
            </p>
            <p className="list-item">
              Do not open an gripURL.com link in a popup / popunder or iframe.
            </p>
            <p className="list-item">
              Only the gripURL.com link must be opened when a user clicks on the
              link. No other links / windows must be opened.
            </p>

            <p className="direct c-tertiary">
              Each time you use or cause access to this web site, you agree to
              be bound by these Terms of Usage, and as amended from time to time
              with or without notice to you. In addition, we reserve the right
              to delete any account or link we feel violates our terms of usage.
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        title="Privacy Policy"
        isOpen={policyModalOpen}
        close={() => setPolicyModal(false)}
      >
        <div className="policy">
          <div className="group">
            <h4 className="c-tertiary">Collecting Personal Information</h4>
            <p className="c-primary">
              Throughout your visit, and/or use of our service, we may collect,
              store, and/or use the following information: (a) your computer
              (browser information, operating system, geographical location,
              etc), (b) the information you provide when signing up (email,
              name)
            </p>
          </div>
          <div className="group">
            <h4 className="c-tertiary">Cookie Information</h4>
            <p className="c-primary">
              We use cookies. Turning off cookies may result in some features of
              our website not working properly.
            </p>
          </div>
          <div className="group">
            <h4 className="c-tertiary">Changes in Policy</h4>
            <p className="c-primary">
              We reserve the right to make policy changes at anytime. Users will
              be notified of these changes. By continuing to access this site
              after the date of modification, you are indicating that you agree
              to be bound by the modified Terms of Usage.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
