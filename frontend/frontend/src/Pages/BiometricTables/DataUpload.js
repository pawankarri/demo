
import { Grid, Paper , TextField, Button, Input,Box,Link,Typography,Container, Divider, Modal} from "@mui/material";
import FingerprintIcon from '@mui/icons-material/Fingerprint';

import InventoryIcon from '@mui/icons-material/Inventory';
import { Dropzone } from "@mantine/dropzone";
import Swarm from "../../images/Swarm.png"
import { useState } from "react";
import { BiometricServiceModule } from "../../Services/BiometricService/BiometricServiceModule";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useDropzone } from "react-dropzone";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import axios from "axios";
import { toast } from "react-toastify";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Loading from "../../Components/LoadingComponent/Loading";
import upload from "../../images/upl.png"
import { baseUrl } from "../../Server/baseUrl";
import { hasAuthority } from "../../Services/AccessLevel/AccessLevelService";
import { NoAuth } from "../../Components/HelperComponent/NoAuth";
import { GlobalButton } from "../../Components/stylecomponent/GlobalButton";
import MissingReportUpdateModal from "./MissingReports/MissingReportUpdateModal";

export const  BIOMETRIC_DATA_UPLOAD_PAGE_TITLE= "BIOMETRIC_DATA_UPLOAD"


export default function DataUpload(){

const[biometric,setBiometric]=useState([])


const fileHandler=(file)=>{
  setBiometric(file[0])
}
const token = localStorage.getItem("token")
let form =new FormData()
form.append("file",biometric)

const[isloading,setisloading]=useState(false)

const fileDataSubmit=(e)=>{
    e.preventDefault()
    setisloading(true)
    if(biometric.length==0){
        toast.info("Please select a file to upload",{position:toast.POSITION.TOP_RIGHT})
        setisloading(false)
        return
    }
else{

axios({
    method: "post",
    url: `${baseUrl}/biometric/add-file`,
    data:form,
    headers: { "Content-Type": 'multipart/form-data' ,"Authorization" : 'Bearer ' + token},
  }).then((res)=>{
 if(res.status===200 && res.data.status==="Success"){
    setisloading(false)
    toast.success(res.data.message,{position:toast.POSITION.TOP_RIGHT})
    setBiometric("");
}
else if( res.status===200 && res.data.status===400){
    setisloading(false)
    toast.info(res.data.message,{position:toast.POSITION.TOP_RIGHT})

}
else{
    setisloading(false)
    toast.error(res.data.message,{position:toast.POSITION.TOP_RIGHT})
}

}).catch((error)=>{
    setisloading(false)
    toast.error(error.response.data.message,{position:toast.POSITION.TOP_RIGHT})
})

}
}


  //backbutton
  const backbutton=useNavigate()

  


  const handleUpdateClick = ()=>{

    setisloading(true);
    BiometricServiceModule.updateIsLateReport().then(
        res=>{
           if(res.status === 200){
            setisloading(false)
            toast.success(res.message,{position:toast.POSITION.TOP_RIGHT})
           }
        }
    ).catch(
        
        error=>{
            setisloading(false)
            toast.success("Not Updated",{position:toast.POSITION.TOP_RIGHT});}
    )

  }

const[updatemissingreport,setupdatemissingreport]=useState(false)

  const handleUpdateClick1 = (e)=>{
  e.preventDefault()
  setupdatemissingreport(!updatemissingreport)
  }


return hasAuthority(BIOMETRIC_DATA_UPLOAD_PAGE_TITLE)?  (
    isloading?<Loading></Loading>:
    <Box style={{backgroundColor:"#FFFFFF",height:"auto"}}>
        <form onSubmit={fileDataSubmit} method="post" enctype="multipart/form-data">

    
    <Box sx={{
           display: 'flex',
           alignContent: 'center',
           justifyContent: 'space-between',
           alignContent:"center",
           
       }}>
        <Typography color={"secondary"} style={{marginLeft:"10px",fontSize:"21px",marginTop:"20px",fontFamily:"Times New Roman Times"}}>BIO-METRIC</Typography>
          
       </Box>


   <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>
    
    
    <section className="dropbox">

    <Container style={{padding:"20px",marginTop:10}} className="container">
        <Paper elevation={0} style={{width:"auto"}} >
        
        
        <Box sx={{ flexFlow: 1 }}>
            <Grid sx={{display:"flex"}} container spacing={1} gap={3}  justifyContent={"center"}
             alignItems={"center"} alignContent={"center"}>

                <Grid item xs={12} sx={{display:'flex',
                justifyContent:'center',
                alignItems:'center'
            }}>


   <Dropzone id="file-upload" maxFiles={3} multiple={true} loading={false} value={biometric}  onDrop={fileHandler} >
       
       <Grid container style={{height:"30vh",minWidth:"35vw",}} >
      

        <Grid item xs={12} sx={{justifyContent:"center",alignContent:"center",alignItems:"center"}}>
        <Typography align="center"> Drag  or click here to select files</Typography>
        
        </Grid>

      <Grid item xs={12} sx={{ display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center"}}>
            {/* <InventoryIcon  sx={{borderRadius:"50%",fontSize:"90px"}}></InventoryIcon> */}
            <img style={{width:"150px",height:"auto"}}src={upload}></img>
            {/* 'https://www.pngall.com/wp-content/uploads/2/Upload-PNG-Image-File.png' */}
        </Grid>
<Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center"}}>
{/* <Input disabled id="uploadFile"></Input> */}<Button variant="outlined">Select File <InsertDriveFileOutlinedIcon style={{fontSize:"16px"}}/></Button>
</Grid>


          
      </Grid>   
       </Dropzone>

                </Grid>

<Grid item xs={12} sx={{display:'flex',
                    justifyContent:'center',
                    alignItems:'center'
                }}>

                        <Button  disableElevation endIcon={<FileUploadOutlinedIcon/>} type="submit" sx={{marginBottom:"10px"}}  variant='contained'  style={GlobalButton.OperationButton}>Upload </Button>
                    </Grid>
            

            </Grid>
        </Box>
        {/* </form> */}
        </Paper>
    </Container>
   
    <GlobalButton.GlobalDivider1></GlobalButton.GlobalDivider1>
    </section>
   { biometric.length===0 ? null: <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center",marginLeft:"55px",marginTop:"15px"}}>
    <Input disabled  id="uploadFile" value={biometric?.path}></Input>
<Button onClick={(e)=>{setBiometric([])}} type="reset"><ClearOutlinedIcon  style={{color:"red"}}/></Button>
</Grid>}


</form>

<Box   sx={{display:"flex"}}>
<Grid container spacing={3} sx={{display:"flex"}}>
  <Grid item xs={6} sx={{display:"flex",justifyContent:"flex-end"}}> 
  <Button   disableElevation sx={{mt:2,minWidth:70,height:40,borderRadius:40,width:240}} onClick={handleUpdateClick} variant='contained' >Update Biometric</Button>   
</Grid>
<Grid item xs={6} sx={{display:"flex"}}> 
<Button disableElevation sx={{mt:2,minWidth:70,height:40,borderRadius:40,width:240}} onClick={handleUpdateClick1} variant='contained' >Update Missing Reports</Button>

<Modal open={updatemissingreport}>
<MissingReportUpdateModal onClose={()=>{setupdatemissingreport(false)}} />
</Modal>

</Grid>
</Grid>

</Box>

   
</Box>


    ):<NoAuth></NoAuth>

}