import './App.css';
import Header from './Components/Header'
import ProfilePage from './Components/ProfilePage'
import HomePage from './Components/HomePage'
import SearchPage from './Components/SearchPage'
import { BrowserRouter as Router, Redirect, Route, Routes } from 'react-router-dom';
import { Row, Container } from "react-bootstrap";
import { useState, useEffect } from "react";


function App() {

  const [editMode, setEditMode] = useState(false);
  const [home, setHome] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const [previousPage, setPreviousPage] = useState("/");
  const [account, setAccount] = useState("Maneskin");
  const [trophies, setTrophies] = useState({});
  const [idTrophy, setIdTrophy] = useState();
  
  
  const genresLegenda = ["Rock", "Pop", "Jazz", "Metal", "Blues", "Classical Music", "Folk", "Funky"];
  const instruments = ["Singer", "Guitar", "Violin", "Bass", "Drums","Trumpet","Saxophone","Piano", "Flute", "Cello", "Electric Guitar", "Keyboard", "Mixing Console"];

  const switchHomeStatus = async (homeStatus, previousPage, newPage) => {
    setHome(homeStatus);
    setPreviousPage(previousPage);
    setCurrentPage(newPage);
  }

  return (
    <Container fluid>
      <Router>
        <Row>
          <Header previousPage={previousPage} account={account} setAccount={setAccount} page={currentPage} editMode={editMode} setEditMode={setEditMode} home={home} trophies={trophies} idTrophy={idTrophy}/>
        </Row>

        <Routes>
          <Route exact path="/" element={
            <Row>
              <HomePage switchHomeStatus={switchHomeStatus} />
            </Row>
          }/>
          <Route path="/profile/:id" element={
            <Row>
              <ProfilePage switchHomeStatus={switchHomeStatus} page={currentPage} account={account} editMode={editMode} setEditMode={setEditMode} newMusician={false} genresLegenda={genresLegenda} instruments={instruments} trophies={trophies} setTrophies={setTrophies} setIdTrophy={setIdTrophy} />
          </Row> 
          }/>
          <Route path="/user" element={
            <Row>
              <SearchPage switchHomeStatus={switchHomeStatus} account={account} genresLegenda={genresLegenda} instruments={instruments} setEditMode={setEditMode} setTrophies={setTrophies} />
          </Row> 
          }/>
          <Route path="/musicians" element={//musicians list
          <p></p>
          }/>

        </Routes>
      </Router>
    </Container>
  );
}

export default App;
