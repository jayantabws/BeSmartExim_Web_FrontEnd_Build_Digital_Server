import { Modal } from 'react-bootstrap';
const DownloadLoader = (props) =>{

   // console.log("DownloadLoader Call ", props);
    return(
        <Modal  show={true} 
        backdrop="static"
        keyboard={false}>
            <div className="loaderBlock" >
                {/*<div className="loader"></div>*/}

                <h4>Downloading Data.</h4> Please wait..
                <div class="cm-spinner"></div>
            </div>
        </Modal>
    )
}

export default DownloadLoader;