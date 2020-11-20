import React, { useState } from "react";
import Modal from "./Modal";

export default function Footer() {
  const [termsModalOpen, setTermsModal] = useState(false);
  const [policyModalOpen, setPolicyModal] = useState(false);
  return (
    <>
      <footer className="b-tertiary c-white">
        <div>
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
        </div>
        <div>Copyright &copy; 2020 gripURL</div>
      </footer>
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
            <p className="list-item">Pooaosdapsdpapdoa aodasod asdjasdhasnd</p>
            <p className="list-item">
              lorem ipsum rdl asdh sjasdas ireun asjdsgdb assallas sdksks
              allasd. asdjadssasdaj askdhc a.
            </p>
            <p className="list-item">
              Asdhadh Lpkasd ausasdja ajsdjasd llasdiajs alsasdus. adjasdjsd
              skdaskdsdsdsa sdsa.
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
            <h4 className="c-tertiary">Lorem</h4>
            <p className="c-primary">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
              quisquam adipisci soluta modi itaque recusandae sapiente quibusdam
              consequuntur exercitationem est.
            </p>
          </div>
          <div className="group">
            <h4 className="c-tertiary">Ipsum</h4>
            <p className="c-primary">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
              quisquam adipisci soluta modi itaque recusandae sapiente quibusdam
              consequuntur exercitationem est.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
