import React, { FormEvent, useEffect, useState } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles, styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AppBar, Button, ButtonGroup, Link, Paper, Tab, Tabs } from '@mui/material';
import { TabPanel } from './components/TabPanel';
import { DataGrid } from '@material-ui/data-grid';
import Uploader from './components/CsvUploader';
import BarChart from './components/BarChart';

interface User {
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
  expanded: boolean;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };
  const [file, setFile] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  const queryData = async (query?: string) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/bills${query ? '?q=' + query : ''}`);
      console.log(data);
      setData(data);
    } catch (error) {
      console.error('Error reading file:', error);
      setData([]);
      toast.error('Error reading file')
    }
  }

  useEffect(() => {
    queryData('');
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);
      setValue(0);
      queryData('');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file')
    }
  };

  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      queryData((e.target as HTMLInputElement).value);
    }
  }

  const handleExpandClick = (index: number) => {
    const newData = [...(data || [])];
    newData[index] = { ...newData[index], expanded: !newData[index].expanded }
    setData(newData);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 110 },
    {
      field: "nClient",
      headerName: "nClient",
      width: 100,
    },
    {
      field: "month",
      headerName: "month",
      width: 100,
    },
    {
      field: "energiaQtSCEE",
      headerName: "energiaQtSCEE",
      width: 100,
    },
    {
      field: "energiaVSCEE",
      headerName: "energiaVSCEE",
      width: 150,
    },
    {
      field: "energiaQtGDI",
      headerName: "Qtd. Energia Compensada",
      width: 200,
    },
    {
      field: "energiaVGDI",
      headerName: "Valor Energia Compensada",
      width: 200,
    },
    {
      field: "energiaQt",
      headerName: "Qtd de Energia Elétrica",
      width: 200,
    },
    {
      field: "energiaV",
      headerName: "Preço Unit de Energia Elétrica",
      width: 200,
    },
    {
      field: "contribMun",
      headerName: "contribMun",
      width: 200,
    },
    {
      flex: 0.1,
      minWidth: 170,
      sortable: false,
      field: 'actions',
      headerName: 'Ações',
      renderCell: ({ row }: any) => (
        <Link href={`${process.env.REACT_APP_API_URL}/download/${row.pathFile.split('/')[1]}`}>
          <ButtonGroup>
            <Button title="Baixar" color="primary">
              Baixar
            </Button>
          </ButtonGroup>
        </Link>
      )
    }
  ];


  return (
    <div className="App">
      <ToastContainer />
      <header className="App-header">
        <AppBar position="static">
          <Paper square>
            <Tabs value={value} onChange={handleChange} indicatorColor="primary"
              textColor="primary" aria-label="simple tabs example">
              <Tab label="Faturas" />
              <Tab label="Energia" />
              <Tab label="Valores" />
              <Tab label="Upload" />
            </Tabs>
          </Paper>
        </AppBar>

        <TabPanel value={value} index={0}>
          <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
            <TextField
              id="search"
              onKeyDown={search}
              InputProps={{
                startAdornment: (
                  <SearchOutlinedIcon />
                ),
              }}
              style={{
                backgroundColor: "white",
                width: 345
              }}
              color="secondary"
              variant="standard"
            />
            <br />
            <DataGrid
              rows={data}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BarChart data={data.map((d: { energiaV: number }) => d.energiaV)} labels={data.map((d: { month: any; }) => d.month)} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <BarChart data={data.map((d: { energiaV: number, energiaQt: number }) => d.energiaV * d.energiaQt)} labels={data.map((d: { month: any; }) => d.month)} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Uploader file={file} setFile={setFile} handleSubmit={handleSubmit} />
        </TabPanel>
      </header>
    </div>
  );
}

export default App;
