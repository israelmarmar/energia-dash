import React, { FormEvent, useState } from 'react';
import './App.css';
import CsvUploader from './components/CsvUploader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
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
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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
  const [file, setFile] = useState<any>(null);
  const [data, setData] = useState<User[]>();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const queryData = async (query: string) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users?q=${query}`);
      setData(data.data);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Error reading file')
    }
  }


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);
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
    newData[index] = {...newData[index], expanded: !newData[index].expanded}
    setData(newData);
  };

  return (
    <div className="App">
      <ToastContainer />
      <header className="App-header">
        {!data ? <CsvUploader file={file} setFile={setFile} handleSubmit={handleSubmit} /> :
          <>
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
            {data.map((row: User, index: number) => (
              <Card sx={{ width: 345 }}>
                <CardHeader
                  title={row.name}
                />
                <CardActions disableSpacing>
                  <ExpandMore
                    expand={row.expanded}
                    onClick={()=>handleExpandClick(index)}
                    aria-expanded={row.expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={row.expanded || false} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>
                      City: {row.city}
                    </Typography>
                    <Typography paragraph>
                      Country: {row.country}
                    </Typography>
                    <Typography paragraph>
                      Favorite Sport: {row.favorite_sport}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </>
          }
      </header>
    </div>
  );
}

export default App;
