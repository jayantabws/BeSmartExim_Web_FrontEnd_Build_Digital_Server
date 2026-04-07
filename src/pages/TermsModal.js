import React from "react";
import { Modal } from "react-bootstrap";
import TermsContent from "./TermsContent";
import './TermsModel.css';

function TermsModal({ show, onAgree, onDisagree }) {
  return (
    <Modal
      show={show} // Use the raw boolean
      backdrop="static"
      keyboard={false}
      centered
      size="xl"
      animation={false} // Disabling animation on reload helps prevent "ghost" backdrops
      style={{ zIndex: 1060 }} // Ensure it stays above everything
    >
      <Modal.Header>
        <Modal.Title>Terms & Conditions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TermsContent onAgree={onAgree} onDisagree={onDisagree} />
      </Modal.Body>
    </Modal>
  );
}

// function TermsModal({ show, onAgree, onDisagree }) {
//   return (
//     <Modal
//       show={Boolean(show)}
//       backdrop="static"
//       keyboard={false}
//       centered
//       size="xl"
//     >
//       <Modal.Header>
//         <Modal.Title>Terms & Conditions</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <TermsContent
//           onAgree={onAgree}
//           onDisagree={onDisagree}
//         />
//       </Modal.Body>
//     </Modal>
//   );
// }

 export default TermsModal;