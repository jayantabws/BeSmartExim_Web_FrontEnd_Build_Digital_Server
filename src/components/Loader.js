import { Modal } from 'react-bootstrap';
const Loader = (props) =>{
    return(
        <Modal  show={true} 
        backdrop="static"
        keyboard={false}>
            <div className="loaderBlock" >
                {/*<div className="loader"></div>*/}

                <h4>Retrieving Data.</h4> Please wait..
                <div class="cm-spinner"></div>
            </div>
        </Modal>
    )
}

export default Loader;