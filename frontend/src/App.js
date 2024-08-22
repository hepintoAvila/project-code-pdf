import logo from './logo.png';
import './App.css';
import UploadFile from './components/UploadFile';
import DataGrid from './components/DataGrid';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Cargue <code>el pdf</code> para generar el codigo dentro del pdf.
        </p>
        <div>
      <UploadFile />
      <DataGrid/>
    </div>
      </header>
    </div>
  );
}

export default App;
