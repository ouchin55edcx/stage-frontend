// src/services/statistics.js
import axios from 'axios';
import { API_URL } from './api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Chart from 'chart.js/auto';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fetch all statistics data
 * @returns {Promise<Object>} Statistics data object
 */
export const fetchStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

/**
 * Fetch my statistics data
 * @returns {Promise<Object>} My statistics data object
 */
export const fetchMyStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Fetching statistics with token:', token ? 'Token exists' : 'No token found');

    const response = await axios.get(`${API_URL}/my-statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Statistics API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques');
  }
};

/**
 * Format statistics data for charts and display
 * @param {Object} data - Raw statistics data from API
 * @returns {Object} Formatted data for dashboard
 */
export const formatStatisticsForDashboard = (data) => {
  if (!data) return null;

  return {
    users: {
      total: data.users.total || 0,
      admins: data.users.admins || 0,
      employers: data.users.employers || 0,
      active: data.users.active_employers || 0,
      inactive: data.users.inactive_employers || 0,
      recent: data.users.recent_users || [],
      byService: data.users.employers_by_service || {}
    },
    equipment: {
      total: data.equipment.total || 0,
      active: data.equipment.active || 0,
      onHold: data.equipment.on_hold || 0,
      inProgress: data.equipment.in_progress || 0,
      byType: data.equipment.by_type || [],
      byBrand: data.equipment.by_brand || [],
      backupEnabled: data.equipment.backup_enabled_count || 0,
      backupDisabled: data.equipment.backup_disabled_count || 0,
      recent: data.equipment.recent || []
    },
    services: {
      total: data.services.total || 0,
      withEmployers: data.services.with_employers || 0,
      withoutEmployers: data.services.without_employers || 0,
      distribution: data.services.employers_distribution || []
    },
    declarations: {
      total: data.declarations.total || 0,
      pending: data.declarations.pending || 0,
      approved: data.declarations.approved || 0,
      rejected: data.declarations.rejected || 0,
      recent: data.declarations.recent || []
    },
    interventions: {
      total: data.interventions.total || 0,
      recent: data.interventions.recent || [],
      byMonth: data.interventions.by_month || []
    },
    licenses: {
      total: data.licenses.total || 0,
      expiringSoon: data.licenses.expiring_soon || 0,
      expired: data.licenses.expired || 0,
      byType: data.licenses.by_type || []
    },
    timeStats: {
      declarationsByMonth: data.time_stats.declarations_by_month || [],
      equipmentByMonth: data.time_stats.equipment_by_month || [],
      usersByMonth: data.time_stats.users_by_month || []
    }
  };
};

/**
 * Generate a PDF report from statistics data
 * @param {string} elementId - ID of the HTML element to capture for the PDF
 * @param {string} filename - Name of the PDF file to download
 */
export const generateStatisticsReport = async (elementId, filename = 'rapport-statistiques.pdf') => {
  try {
    // First fetch the statistics data
    const statsData = await fetchStatistics();

    // Create a temporary div to render the report
    const reportContainer = document.createElement('div');
    reportContainer.id = 'statistics-report-container';
    reportContainer.style.width = '800px';
    reportContainer.style.padding = '30px';
    reportContainer.style.backgroundColor = 'white';
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    reportContainer.style.fontFamily = "'Segoe UI', Arial, sans-serif";
    document.body.appendChild(reportContainer);

    // Format the date
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')}`;

    // Create the report header
    const headerHTML = `
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1976D2;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: left;">
            <h1 style="color: #1976D2; font-size: 28px; margin: 0;">SCE Chemicals</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Rapport Statistique</p>
          </div>
          <div style="text-align: right;">
            <p style="color: #666; margin: 0;">Généré le ${formattedDate} à ${formattedTime}</p>
            <p style="color: #666; margin: 5px 0 0 0;">Parc Informatique</p>
          </div>
        </div>
      </div>
    `;

    // Create chart canvases
    const usersChartCanvas = document.createElement('canvas');
    usersChartCanvas.id = 'users-chart';
    usersChartCanvas.width = 400;
    usersChartCanvas.height = 200;

    const equipmentChartCanvas = document.createElement('canvas');
    equipmentChartCanvas.id = 'equipment-chart';
    equipmentChartCanvas.width = 400;
    equipmentChartCanvas.height = 200;

    const declarationsChartCanvas = document.createElement('canvas');
    declarationsChartCanvas.id = 'declarations-chart';
    declarationsChartCanvas.width = 400;
    declarationsChartCanvas.height = 200;

    const interventionsChartCanvas = document.createElement('canvas');
    interventionsChartCanvas.id = 'interventions-chart';
    interventionsChartCanvas.width = 400;
    interventionsChartCanvas.height = 200;

    // Create the main content structure
    reportContainer.innerHTML = headerHTML;

    // Create summary section
    const summarySection = document.createElement('div');
    summarySection.style.marginBottom = '40px';
    summarySection.innerHTML = `
      <h2 style="color: #1976D2; font-size: 22px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">
        Résumé des Statistiques
      </h2>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Utilisateurs</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Total:</span>
            <span style="font-weight: bold; color: #333;">${statsData.users?.total || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Admins:</span>
            <span style="font-weight: bold; color: #333;">${statsData.users?.admins || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666;">Employés:</span>
            <span style="font-weight: bold; color: #333;">${statsData.users?.employers || 0}</span>
          </div>
        </div>

        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Équipements</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Total:</span>
            <span style="font-weight: bold; color: #333;">${statsData.equipment?.total || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Actifs:</span>
            <span style="font-weight: bold; color: #333;">${statsData.equipment?.active || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666;">En attente:</span>
            <span style="font-weight: bold; color: #333;">${statsData.equipment?.onHold || 0}</span>
          </div>
        </div>

        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Services</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Total:</span>
            <span style="font-weight: bold; color: #333;">${statsData.services?.total || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Avec employés:</span>
            <span style="font-weight: bold; color: #333;">${statsData.services?.withEmployers || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666;">Sans employés:</span>
            <span style="font-weight: bold; color: #333;">${statsData.services?.withoutEmployers || 0}</span>
          </div>
        </div>
      </div>
    `;
    reportContainer.appendChild(summarySection);

    // Create charts section
    const chartsSection = document.createElement('div');
    chartsSection.style.marginBottom = '40px';
    chartsSection.innerHTML = `
      <h2 style="color: #1976D2; font-size: 22px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">
        Graphiques
      </h2>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-bottom: 30px;">
        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Répartition des Utilisateurs</h3>
          <div style="height: 200px;">
            <div id="users-chart-container"></div>
          </div>
        </div>

        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">État des Équipements</h3>
          <div style="height: 200px;">
            <div id="equipment-chart-container"></div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;">
        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">État des Déclarations</h3>
          <div style="height: 200px;">
            <div id="declarations-chart-container"></div>
          </div>
        </div>

        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Interventions par Mois</h3>
          <div style="height: 200px;">
            <div id="interventions-chart-container"></div>
          </div>
        </div>
      </div>
    `;
    reportContainer.appendChild(chartsSection);

    // Create details section
    const detailsSection = document.createElement('div');
    detailsSection.style.marginBottom = '40px';
    detailsSection.innerHTML = `
      <h2 style="color: #1976D2; font-size: 22px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">
        Détails Supplémentaires
      </h2>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;">
        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Interventions Récentes</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <th style="text-align: left; padding: 8px 5px; color: #666;">Date</th>
                <th style="text-align: left; padding: 8px 5px; color: #666;">Technicien</th>
              </tr>
            </thead>
            <tbody>
              ${(statsData.interventions?.recent || []).slice(0, 5).map(item => `
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 8px 5px; color: #333;">${item.date || 'N/A'}</td>
                  <td style="padding: 8px 5px; color: #333;">${item.technician_name || 'N/A'}</td>
                </tr>
              `).join('')}
              ${(statsData.interventions?.recent || []).length === 0 ? `
                <tr>
                  <td colspan="2" style="padding: 8px 5px; color: #666; text-align: center;">Aucune intervention récente</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>

        <div style="background-color: #f5f9ff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="color: #1976D2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Licences</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Total:</span>
            <span style="font-weight: bold; color: #333;">${statsData.licenses?.total || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Expirant bientôt:</span>
            <span style="font-weight: bold; color: #ff9800;">${statsData.licenses?.expiringSoon || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span style="color: #666;">Expirées:</span>
            <span style="font-weight: bold; color: #f44336;">${statsData.licenses?.expired || 0}</span>
          </div>

          <h4 style="color: #1976D2; font-size: 16px; margin: 20px 0 10px 0;">Répartition par Type</h4>
          <div style="max-height: 120px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <th style="text-align: left; padding: 8px 5px; color: #666;">Type</th>
                  <th style="text-align: right; padding: 8px 5px; color: #666;">Nombre</th>
                </tr>
              </thead>
              <tbody>
                ${(statsData.licenses?.byType || []).map(item => `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 8px 5px; color: #333;">${item.type || 'N/A'}</td>
                    <td style="padding: 8px 5px; color: #333; text-align: right;">${item.count || 0}</td>
                  </tr>
                `).join('')}
                ${(statsData.licenses?.byType || []).length === 0 ? `
                  <tr>
                    <td colspan="2" style="padding: 8px 5px; color: #666; text-align: center;">Aucune donnée disponible</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    reportContainer.appendChild(detailsSection);

    // Add footer
    const footerSection = document.createElement('div');
    footerSection.style.marginTop = '40px';
    footerSection.style.borderTop = '1px solid #e0e0e0';
    footerSection.style.paddingTop = '20px';
    footerSection.style.textAlign = 'center';
    footerSection.style.color = '#666';
    footerSection.style.fontSize = '12px';
    footerSection.innerHTML = `
      <p>Ce rapport a été généré automatiquement par le système de gestion du parc informatique de SCE Chemicals.</p>
      <p>© ${new Date().getFullYear()} SCE Chemicals - Tous droits réservés</p>
    `;
    reportContainer.appendChild(footerSection);

    // Add chart containers
    const usersChartContainer = document.getElementById('users-chart-container');
    usersChartContainer.appendChild(usersChartCanvas);

    const equipmentChartContainer = document.getElementById('equipment-chart-container');
    equipmentChartContainer.appendChild(equipmentChartCanvas);

    const declarationsChartContainer = document.getElementById('declarations-chart-container');
    declarationsChartContainer.appendChild(declarationsChartCanvas);

    const interventionsChartContainer = document.getElementById('interventions-chart-container');
    interventionsChartContainer.appendChild(interventionsChartCanvas);

    // Create charts
    // Users chart
    new Chart(usersChartCanvas, {
      type: 'pie',
      data: {
        labels: ['Admins', 'Employés Actifs', 'Employés Inactifs'],
        datasets: [{
          data: [
            statsData.users?.admins || 0,
            statsData.users?.active || 0,
            statsData.users?.inactive || 0
          ],
          backgroundColor: ['#1976D2', '#4CAF50', '#9E9E9E'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                size: 10
              }
            }
          }
        }
      }
    });

    // Equipment chart
    new Chart(equipmentChartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Actifs', 'En attente', 'En cours'],
        datasets: [{
          data: [
            statsData.equipment?.active || 0,
            statsData.equipment?.onHold || 0,
            statsData.equipment?.inProgress || 0
          ],
          backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                size: 10
              }
            }
          }
        }
      }
    });

    // Declarations chart
    new Chart(declarationsChartCanvas, {
      type: 'bar',
      data: {
        labels: ['En attente', 'Approuvées', 'Rejetées'],
        datasets: [{
          label: 'Nombre',
          data: [
            statsData.declarations?.pending || 0,
            statsData.declarations?.approved || 0,
            statsData.declarations?.rejected || 0
          ],
          backgroundColor: ['#FF9800', '#4CAF50', '#F44336'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    // Interventions by month chart
    const monthLabels = statsData.interventions?.byMonth?.map(item => item.month) ||
                        ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const monthData = statsData.interventions?.byMonth?.map(item => item.count) ||
                      [0, 0, 0, 0, 0, 0];

    new Chart(interventionsChartCanvas, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Interventions',
          data: monthData,
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    // Wait for charts to render
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate PDF from the temporary div
    const canvas = await html2canvas(reportContainer, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // If the content is too long for one page, split it across multiple pages
    const maxHeight = pdf.internal.pageSize.getHeight();

    if (pdfHeight <= maxHeight) {
      // Content fits on one page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } else {
      // Content needs multiple pages
      let heightLeft = pdfHeight;
      let position = 0;
      let page = 1;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= maxHeight;

      while (heightLeft > 0) {
        position = -maxHeight * page;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= maxHeight;
        page++;
      }
    }

    pdf.save(filename);

    // Clean up - remove the temporary div
    document.body.removeChild(reportContainer);

    return true;
  } catch (error) {
    console.error('Error generating statistics report:', error);
    throw new Error('Erreur lors de la génération du rapport statistique');
  }
};
