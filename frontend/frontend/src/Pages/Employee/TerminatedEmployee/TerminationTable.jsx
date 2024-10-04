import React, { useEffect, useState } from 'react'
import { TerminationTableStyle } from './TerminatedEmployeeFormStyle'
import { Box, Button, Grid, Modal, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Loading from '../../../Components/LoadingComponent/Loading'
import { hasAuthority } from '../../../Services/AccessLevel/AccessLevelService'
import { NoAuth } from '../../../Components/HelperComponent/NoAuth'
import moment from 'moment'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { GlobalButton } from '../../../Components/stylecomponent/GlobalButton'
import { ResignedEmployee } from '../../../Services/employee-service/EmployeeService'
import { toast } from 'react-toastify'
import TerminatedEmployeeForm from './TerminatedEmployeeForm'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function getempnameid(params) {
  return params.row?.empId+" -"+params.row?.empName
}

const columns = [
    { 
      field: 'empId',
     headerName: 'Employee Name',
     minWidth: 100,
      flex:1.5,
     headerClassName:'table-header',
     valueGetter:getempnameid
     
    },
  
    { 
    field: 'startDate',
     headerName: 'Start Date', 
     minWidth: 120,
      flex:1.5,
     headerClassName:'table-header',
     valueFormatter: params => 
     moment(params?.value).format("DD/MM/YYYY"),
  
     
    },
    { 
     field: 'endDate',
     headerName: 'End Date', 
     minWidth: 120,
     flex:1.5,
     headerClassName:'table-header',
     valueFormatter: params => 
     {
      let enddate=""
      if(params?.value!==null){
       enddate=moment(params?.value).format("DD/MM/YYYY")
      return enddate
      }
   else{
     return null
   }
     }
  
    },
    { 
        field: 'modifiedBy',
       headerName: 'Modified By',
       minWidth: 100,
        flex:1.5,
       headerClassName:'table-header'
       
      },
    
    { 
      field: 'modifiedDate',
     headerName: 'Modified Date', 
     minWidth: 120,
      flex:1.5,
     headerClassName:'table-header',
     valueFormatter: params => 
     moment(params?.value).format("DD/MM/YYYY"),
  
     
    },
    { 
        field: 'comment',
       headerName: 'Comment',
       minWidth: 150,
        flex:2.5,
       headerClassName:'table-header'
       
      },
]

export const ALL_EMPLOYEE_TERMINATION_PAGE_TITLE=" ALL_EMPLOYEE_TERMINATION_765"

export default function TerminationTable() {
  const[termination,setTermination]=useState([])
  const[isLoading,setIsLoading]=useState(false)
  const[backButoon1,setbackButton1]=useState(false)
  const[reload,setreload]=useState(false)
  const handlefilter=()=>{
    setbackButton1(true)
  }
  

function fetchTerminatedEmployee(){
  setIsLoading(true)

  ResignedEmployee.ResigedEmployeeData().then((res)=>{
            if(res.statusMessage==="success"){
                 setIsLoading(false)
                if(res.result.length==0){
                  toast.info("No Records Found ",{
                      position: toast.POSITION.TOP_RIGHT
                  })}
                  setTermination(res.result)
              }
              else{
                setIsLoading(false)
                toast.error(res.message, {
                  position: toast.POSITION.TOP_RIGHT
              })
              }
          
            }).catch((err)=>{
          
            setIsLoading(false)
            toast.error(err.message, {
              position: toast.POSITION.TOP_RIGHT
          })
            })
}

const[terminationmodal,setTerminationmodal]=useState(false)
useEffect(()=>{
fetchTerminatedEmployee()
setbackButton1(false)
},[terminationmodal,reload])



   


  return hasAuthority(ALL_EMPLOYEE_TERMINATION_PAGE_TITLE)? (
    isLoading ? <Loading/>:
    <Box  style={TerminationTableStyle.firstBox}>
      <Box  style={TerminationTableStyle.SecondBox}>
        
                  <Typography  style={TerminationTableStyle.typographystyle}>RESIGNED EMPLOYEES</Typography>
                  <Grid style={{justifyContent:"center"}}>
                  <Button variant='outlined'  style={TerminationTableStyle.backbuttonstyle} 
                  startIcon={<IndeterminateCheckBoxIcon/>}  
                  onClick={()=>{setTerminationmodal(!terminationmodal)}}
                  >
                        ADD RESIGNED EMPLOYEE
                </Button>
                <Modal open={terminationmodal} style={{overflow:"scroll"}}>
            <TerminatedEmployeeForm onclose={()=>{setTerminationmodal(false)}}></TerminatedEmployeeForm>

                </Modal>

                {
  backButoon1 ?<Button variant='outlined' style={TerminationTableStyle.backbuttonstyle}
  onClick={()=>{setreload(!reload)}}
  startIcon={<ArrowBackIosNewIcon/>}>
back
 </Button>:null
}

                </Grid>
                 </Box>
                 
                 
 <GlobalButton.GlobalDivider></GlobalButton.GlobalDivider>

             
                 
                <Box  style={TerminationTableStyle.DatagridBoxStyle}>
                 <DataGrid
                  rows={termination}
                  columns={columns} 
                  onFilterModelChange={handlefilter}
                  getRowId={(termination) => termination.resignedId}     
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'modifiedDate', sort: 'desc' }],
                          },
                    ...termination.initialState,
                    pagination: { paginationModel: { pageSize: 8 } },
                  }}
                  // onRowClick={handleRow}
                  pageSizeOptions={[8,15,25,50,75]}
                 />
                 </Box>
    </Box>

  ):<NoAuth></NoAuth>
}
