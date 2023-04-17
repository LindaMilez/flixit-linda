import { Modal, ModalBody } from "reactstrap";
import YouTube from "react-youtube";

const VideoModal = ({ onClose, isOpen, video }) => {
  return (
    <Modal size="lg" onClosed={onClose} isOpen={isOpen} style={{ width: 700 }}>
      <div className="d-flex justify-content-end p-3">
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <ModalBody className="d-flex justify-content-center pb-0" style={{ width: 700 }}>
        <YouTube
          videoId={video.key}
          id={video.id}
        />
      </ModalBody>
    </Modal>
  );
};

export default VideoModal;
