import React, { ChangeEvent, Dispatch, FormEvent } from 'react';

type ICsvUploaderProps = {
  file: any
  setFile: Dispatch<any>
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

const CsvUploader: React.FC<ICsvUploaderProps> = ({file, setFile, handleSubmit}) => {

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload CSV File</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" style={styles.label}>
          <div style={styles.box}>
            {file && file.name ? file.name : 'Choose a file'}
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '2px dashed #ccc',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  box: {
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};


export default CsvUploader;
