import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faToggleOn,
  faToggleOff,
  faSpinner,
  faUsers,
  faUserCheck,
  faUserTimes
} from '@fortawesome/free-solid-svg-icons';
import { fetchEmployers, toggleEmployerStatus } from '../services/employer';
import { useNotifications } from '../contexts/NotificationContext';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  min-width: calc(100vw - 250px);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00AEEF 0%, #0066CC 50%, #004499 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  position: relative;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #00AEEF, #0066CC);
    border-radius: 2px;
  }

  svg {
    color: #00AEEF;
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;

    svg {
      font-size: 1.5rem;
    }
  }
`;

const SearchAndFilterContainer = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1.25rem;
  border-radius: 10px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #e2e8f0, #cbd5e1) border-box;
  color: #334155;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 250px;

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #00AEEF, #0066CC) border-box;
    box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.1);
    outline: none;
  }
`;

const FilterSelect = styled.select`
  padding: 0.875rem 1.25rem;
  border-radius: 10px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #e2e8f0, #cbd5e1) border-box;
  color: #334155;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #00AEEF, #0066CC) border-box;
    box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.1);
    outline: none;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.color || '#00AEEF'} 0%, ${props => props.colorEnd || '#0066CC'} 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 8px -2px rgba(0, 174, 239, 0.3);
  min-width: 120px;

  svg {
    font-size: 1.5rem;
    opacity: 0.9;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stat-label {
    font-size: 0.85rem;
    opacity: 0.9;
  }
`;

const TableContainer = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 40px rgba(0, 174, 239, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
`;

const Th = styled.th`
  padding: 1.5rem;
  text-align: left;
  background: linear-gradient(135deg, #00AEEF 0%, #0066CC 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  position: relative;

  &:first-child {
    border-top-left-radius: 16px;
  }

  &:last-child {
    border-top-right-radius: 16px;
  }

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    font-size: 0.85rem;
  }
`;

const Td = styled.td`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  color: #1e293b;
  font-weight: 500;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const TableRow = styled.tr`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: translateX(4px);
    box-shadow: inset 4px 0 0 #00AEEF;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #00AEEF 0%, #0066CC 100%);
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  box-shadow: 0 4px 8px -2px rgba(0, 174, 239, 0.3);
  min-width: 80px;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 16px -4px rgba(0, 174, 239, 0.4);
    background: linear-gradient(135deg, #0066CC 0%, #004499 100%);
  }

  &:active {
    transform: translateY(0) scale(1);
  }

  svg {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-width: 70px;
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active
    ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
    : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'};
  color: ${props => props.active ? '#166534' : '#dc2626'};
  border: 1px solid ${props => props.active ? '#bbf7d0' : '#fecaca'};
  box-shadow: 0 2px 4px -1px ${props => props.active
    ? 'rgba(34, 197, 94, 0.2)'
    : 'rgba(239, 68, 68, 0.2)'};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.active ? '#22c55e' : '#ef4444'};
    animation: ${props => props.active ? pulse : 'none'} 2s ease-in-out infinite;
  }
`;

const ToggleButton = styled.button`
  background: ${props => props.active
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'};
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  box-shadow: ${props => props.active
    ? '0 4px 8px -2px rgba(239, 68, 68, 0.3)'
    : '0 4px 8px -2px rgba(34, 197, 94, 0.3)'};
  min-width: 100px;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: ${props => props.active
      ? '0 8px 16px -4px rgba(239, 68, 68, 0.4)'
      : '0 8px 16px -4px rgba(34, 197, 94, 0.4)'};
    background: ${props => props.active
      ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
      : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'};
  }

  &:active {
    transform: translateY(0) scale(1);
  }

  svg {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-width: 90px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  color: #00AEEF;
  gap: 1rem;

  svg {
    font-size: 3rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: #64748b;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
  margin: 2rem 0;

  &::before {
    content: '👥';
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #475569;
  }

  p {
    font-size: 1rem;
    margin: 0;
    opacity: 0.8;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid #fecaca;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    const loadEmployers = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchEmployers();
        const mappedUsers = data.map(emp => ({
          id: emp.id,
          nom: emp.full_name,
          email: emp.email,
          poste: emp.poste,
          tele: emp.phone,
          role: emp.role || 'employe',
          service_id: emp.service_id,
          is_active: emp.is_active
        }));
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        const errorMessage = 'Erreur lors du chargement des utilisateurs';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadEmployers();
  }, [showError]);

  // Filter users based on search term and status
  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.poste.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user =>
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(user => user.is_active).length,
    inactive: users.filter(user => !user.is_active).length
  };

  const handleToggleStatus = async (user) => {
    try {
      const response = await toggleEmployerStatus(user.id);
      if (response.message) {
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return { ...u, is_active: response.is_active };
          }
          return u;
        });
        setUsers(updatedUsers);

        const statusText = response.is_active ? 'activé' : 'désactivé';
        showSuccess(`Utilisateur "${user.nom}" ${statusText} avec succès`);
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      showError('Erreur lors du changement de statut de l\'utilisateur');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) {
    return (
      <Container>
        <Menu notifications={[]} />
        <MainContent>
          <LoadingContainer>
            <FontAwesomeIcon icon={faSpinner} />
            <div className="loading-text">Chargement des utilisateurs...</div>
          </LoadingContainer>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Menu notifications={[]} />
      <MainContent>
        <Header>
          <Title>
            <FontAwesomeIcon icon={faUsers} />
            Liste des utilisateurs
          </Title>
        </Header>

        <SearchAndFilterContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Rechercher par nom, email ou poste..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FilterSelect value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs uniquement</option>
              <option value="inactive">Inactifs uniquement</option>
            </FilterSelect>
          </SearchContainer>

          <StatsContainer>
            <StatCard color="#00AEEF" colorEnd="#0066CC">
              <FontAwesomeIcon icon={faUsers} />
              <div>
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
            </StatCard>
            <StatCard color="#22c55e" colorEnd="#16a34a">
              <FontAwesomeIcon icon={faUserCheck} />
              <div>
                <div className="stat-number">{stats.active}</div>
                <div className="stat-label">Actifs</div>
              </div>
            </StatCard>
            <StatCard color="#ef4444" colorEnd="#dc2626">
              <FontAwesomeIcon icon={faUserTimes} />
              <div>
                <div className="stat-number">{stats.inactive}</div>
                <div className="stat-label">Inactifs</div>
              </div>
            </StatCard>
          </StatsContainer>
        </SearchAndFilterContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {filteredUsers.length === 0 ? (
          <EmptyState>
            <h3>Aucun utilisateur trouvé</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                : 'Aucun utilisateur n\'a été ajouté pour le moment.'}
            </p>
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Nom</Th>
                  <Th>Email</Th>
                  <Th>Poste</Th>
                  <Th>Téléphone</Th>
                  <Th>Statut</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id} delay={`${index * 0.1}s`}>
                    <Td>{user.nom}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.poste}</Td>
                    <Td>{user.tele}</Td>
                    <Td>
                      <StatusBadge active={user.is_active}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <ActionButtons>
                        <ActionButton onClick={() => handleEdit(user.id)}>
                          <FontAwesomeIcon icon={faEdit} />
                          Modifier
                        </ActionButton>
                        <ToggleButton
                          active={user.is_active}
                          onClick={() => handleToggleStatus(user)}
                        >
                          <FontAwesomeIcon icon={user.is_active ? faToggleOff : faToggleOn} />
                          {user.is_active ? 'Désactiver' : 'Activer'}
                        </ToggleButton>
                      </ActionButtons>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </MainContent>
    </Container>
  );
}

export default UsersList;
