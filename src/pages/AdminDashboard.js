import React, { useEffect, useState } from 'react';
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
import { FaChartBar, FaUsers, FaTools, FaCogs, FaBuilding, FaClipboardList } from 'react-icons/fa';
import Menu from './Menu';
import styled from 'styled-components';
import { fetchStatistics, formatStatisticsForDashboard } from '../services/statistics';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    users: {
      total: 0,
      admins: 0,
      employers: 0,
      active: 0,
      inactive: 0,
      recent: [],
      byService: {}
    },
    equipment: {
      total: 0,
      active: 0,
      onHold: 0,
      inProgress: 0,
      byType: [],
      byBrand: [],
      backupEnabled: 0,
      backupDisabled: 0,
      recent: []
    },
    services: {
      total: 0,
      withEmployers: 0,
      withoutEmployers: 0,
      distribution: []
    },
    declarations: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      recent: []
    },
    interventions: {
      total: 0,
      recent: [],
      byMonth: []
    },
    licenses: {
      total: 0,
      expiringSoon: 0,
      expired: 0,
      byType: []
    },
    timeStats: {
      declarationsByMonth: [],
      equipmentByMonth: [],
      usersByMonth: []
    }
  });

  useEffect(() => {
    const loadStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawStats = await fetchStatistics();
        const formattedStats = formatStatisticsForDashboard(rawStats);
        setDashboardData(formattedStats);
      } catch (error) {
        console.error('Error loading statistics:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Chargement des statistiques...</div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{error}</div>
          </div>
        ) : (
          <>
            {/* Statistiques Rapides - Utilisateurs et Équipements */}
            <StatsGrid>
              <StatCard>
                <h3><FaUsers /> Utilisateurs</h3>
                <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
                  {dashboardData.users.total}
                </div>
                <small>Admins: {dashboardData.users.admins} | Employés: {dashboardData.users.employers}</small>
              </StatCard>

              <StatCard>
                <h3><FaTools /> Équipements</h3>
                <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
                  {dashboardData.equipment.total}
                </div>
                <small>Actifs: {dashboardData.equipment.active} | En attente: {dashboardData.equipment.onHold} | En cours: {dashboardData.equipment.inProgress}</small>
              </StatCard>

              <StatCard>
                <h3><FaBuilding /> Services</h3>
                <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
                  {dashboardData.services.total}
                </div>
                <small>Avec employés: {dashboardData.services.withEmployers} | Sans employés: {dashboardData.services.withoutEmployers}</small>
              </StatCard>

              <StatCard>
                <h3><FaClipboardList /> Déclarations</h3>
                <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
                  {dashboardData.declarations.total}
                </div>
                <small>En attente: {dashboardData.declarations.pending} | Approuvées: {dashboardData.declarations.approved} | Rejetées: {dashboardData.declarations.rejected}</small>
              </StatCard>
            </StatsGrid>

            {/* Statistiques Rapides - Interventions et Licences */}
            <StatsGrid>
              <StatCard>
                <h3><FaChartBar /> Interventions</h3>
                <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
                  {dashboardData.interventions.total}
                </div>
                <small>Interventions totales</small>
              </StatCard>

              <StatCard>
                <h3><FaCogs /> Licences</h3>
                <div style={{ fontSize: '2.5rem', color: '#1976D2' }}>
                  {dashboardData.licenses.total}
                </div>
                <small>Expirant bientôt: {dashboardData.licenses.expiringSoon} | Expirées: {dashboardData.licenses.expired}</small>
              </StatCard>
            </StatsGrid>

            {/* Graphiques */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <ChartCard>
                <h3>Répartition des Équipements par Type</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.equipment.byType.length > 0 ?
                          dashboardData.equipment.byType :
                          [{ name: 'Aucune donnée', value: 1 }]}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {(dashboardData.equipment.byType.length > 0 ?
                          dashboardData.equipment.byType :
                          [{ name: 'Aucune donnée', value: 1 }]).map((entry, index) => (
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
                <h3>Distribution des Employés par Service</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.services.distribution.length > 0 ?
                      dashboardData.services.distribution.map(item => ({
                        name: item.name,
                        value: item.employers_count
                      })) :
                      [{ name: 'Aucune donnée', value: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#42A5F5" name="Nombre d'employés" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Activité des utilisateurs par mois */}
            <ChartCard>
              <h3>Activité des Utilisateurs par Mois</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.timeStats.usersByMonth.length > 0 ?
                    dashboardData.timeStats.usersByMonth.map(item => ({
                      date: `${item.month}/${item.year}`,
                      count: item.count
                    })) :
                    [{ date: 'Aucune donnée', count: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#2196F3"
                      strokeWidth={2}
                      name="Nombre d'utilisateurs"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Statut des équipements */}
            <ChartCard>
              <h3>Statut des Équipements</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Actifs', value: dashboardData.equipment.active },
                    { name: 'En attente', value: dashboardData.equipment.onHold },
                    { name: 'En cours', value: dashboardData.equipment.inProgress }
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
          </>
        )}
      </MainContent>
    </Container>
  );
}

export default Dashboard;
