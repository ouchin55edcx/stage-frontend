import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line, 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FaChartBar, FaUsers, FaTools, FaCogs } from 'react-icons/fa';
import Menu from './Menu';
import styled from 'styled-components';

// Styles
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #F0F4F8;
  color: #0A2540;
  font-family: 'Segoe UI', sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: #E3F2FD;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 50, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ChartCard = styled.div`
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const COLORS = ['#2196F3', '#1976D2', '#90CAF9', '#42A5F5'];

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    equipements: 0,
    interventions: 0,
    enPanne: 0,
    licences: { active: 0, expired: 0 }
  });

  const [interventionsData, setInterventionsData] = useState([]);
  const [equipementTypes, setEquipementTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes, 
          equipementsRes, 
          interventionsRes,
          panneRes,
          licencesRes,
          typesRes,
          interventionsTimeline
        ] = await Promise.all([
          axios.get('/api/users/count'),
          axios.get('/api/equipements/count'),
          axios.get('/api/interventions/mois'),
          axios.get('/api/equipements/panne'),
          axios.get('/api/licences/status'),
          axios.get('/api/equipements/types'),
          axios.get('/api/interventions/timeline')
        ]);

        setStats({
          users: usersRes.data.count,
          equipements: equipementsRes.data.count,
          interventions: interventionsRes.data.count,
          enPanne: panneRes.data.count,
          licences: licencesRes.data
        });

        setEquipementTypes(typesRes.data);
        setInterventionsData(interventionsTimeline.data);

      } catch (error) {
        console.error('Erreur de chargement des données:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Menu notifications={[]} />
      
      <MainContent>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(45deg, #2196F3, #1976D2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Tableau de Bord Opérationnel
        </h1>

        {/* Statistiques Rapides */}
        <StatsGrid>
          <StatCard>
            <h3><FaTools /> Équipements Actifs</h3>
            <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
              {stats.equipements - stats.enPanne}
            </div>
            <small>Total: {stats.equipements}</small>
          </StatCard>

          <StatCard>
            <h3><FaUsers /> Nombre Total des Utilisateurs</h3>
            <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
              {stats.users}
            </div>
            <small>Total des utilisateurs enregistrés</small>
          </StatCard>

          <StatCard>
            <h3><FaChartBar /> Interventions</h3>
            <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
              {stats.interventions}
            </div>
            <small>Ce mois</small>
          </StatCard>

          <StatCard>
            <h3><FaCogs /> Licences Actives</h3>
            <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
              {stats.licences.active}
            </div>
            <small>{stats.licences.expired} expirées</small>
          </StatCard>
        </StatsGrid>

        {/* Graphiques */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <ChartCard>
            <h3>Répartition des Équipements</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={equipementTypes}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {equipementTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <h3>Activité des Interventions</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interventionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="interventions" 
                    stroke="#2196F3" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Statut des équipements */}
        <ChartCard>
          <h3>Statut des Équipements</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[ 
                { name: 'Actifs', value: stats.equipements - stats.enPanne },
                { name: 'En Panne', value: stats.enPanne }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#42A5F5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </MainContent>
    </Container>
  );
}

export default Dashboard;
