import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchInterventions } from '../services/intervention';
import { createMaintenance } from '../services/maintenance';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
`;

const Title = styled.h2`
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  border-radius: 4px;
  background: #3b82f6;
  color: white;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CodeBlock = styled.pre`
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const MaintenanceDebugPage = () => {
  const [interventions, setInterventions] = useState([]);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [testData, setTestData] = useState({
    intervention_id: '',
    maintenance_type: 'Preventive',
    scheduled_date: new Date().toISOString().split('T')[0],
    observations: 'Test maintenance'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInterventions();
  }, []);

  const loadInterventions = async () => {
    try {
      setLoading(true);
      const data = await fetchInterventions();
      console.log('Loaded interventions:', data);
      setInterventions(data);
    } catch (err) {
      console.error('Error loading interventions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInterventionSelect = (e) => {
    const interventionId = e.target.value;
    const intervention = interventions.find(i => i.id === parseInt(interventionId));
    setSelectedIntervention(intervention);
    setTestData(prev => ({ ...prev, intervention_id: interventionId }));
  };

  const testCreateMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      console.log('Testing maintenance creation with data:', testData);
      const result = await createMaintenance(testData);
      console.log('Maintenance creation result:', result);
      setResult(result);
    } catch (err) {
      console.error('Error creating maintenance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Maintenance Creation Debug Page</Title>
      
      <Section>
        <h3>1. Load Interventions</h3>
        <Button onClick={loadInterventions} disabled={loading}>
          {loading ? 'Loading...' : 'Reload Interventions'}
        </Button>
        <p>Found {interventions.length} interventions</p>
        {interventions.length > 0 && (
          <CodeBlock>
            {JSON.stringify(interventions.slice(0, 2), null, 2)}
          </CodeBlock>
        )}
      </Section>

      <Section>
        <h3>2. Select Intervention</h3>
        <FormGroup>
          <Label>Intervention:</Label>
          <Select value={testData.intervention_id} onChange={handleInterventionSelect}>
            <option value="">Select an intervention</option>
            {interventions.map(intervention => (
              <option key={intervention.id} value={intervention.id}>
                ID: {intervention.id} | Equipment: {intervention.equipment?.name || intervention.equipement?.nom || 'Unknown'}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        {selectedIntervention && (
          <div>
            <h4>Selected Intervention Details:</h4>
            <CodeBlock>
              {JSON.stringify(selectedIntervention, null, 2)}
            </CodeBlock>
          </div>
        )}
      </Section>

      <Section>
        <h3>3. Test Maintenance Creation</h3>
        <FormGroup>
          <Label>Maintenance Type:</Label>
          <Select 
            value={testData.maintenance_type} 
            onChange={(e) => setTestData(prev => ({ ...prev, maintenance_type: e.target.value }))}
          >
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
            <option value="Predictive">Predictive</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Scheduled Date:</Label>
          <Input 
            type="date" 
            value={testData.scheduled_date}
            onChange={(e) => setTestData(prev => ({ ...prev, scheduled_date: e.target.value }))}
          />
        </FormGroup>

        <h4>Test Data to Send:</h4>
        <CodeBlock>
          {JSON.stringify(testData, null, 2)}
        </CodeBlock>

        <Button onClick={testCreateMaintenance} disabled={loading || !testData.intervention_id}>
          {loading ? 'Creating...' : 'Test Create Maintenance'}
        </Button>
      </Section>

      {error && (
        <Section>
          <h3>Error:</h3>
          <div style={{ color: 'red' }}>
            {error}
          </div>
        </Section>
      )}

      {result && (
        <Section>
          <h3>Success Result:</h3>
          <CodeBlock>
            {JSON.stringify(result, null, 2)}
          </CodeBlock>
        </Section>
      )}
    </Container>
  );
};

export default MaintenanceDebugPage;
