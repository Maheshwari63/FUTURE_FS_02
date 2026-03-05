let leads = JSON.parse(localStorage.getItem("leads")) || [];
let currentFilter = 'All';

function addLead() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const source = document.getElementById("source").value.trim();

    if (!name || !email || !source) {
        alert("Please fill all fields");
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert("Please enter valid email");
        return;
    }

    leads.unshift({ name, email, source, status: "New", dateAdded: new Date().toISOString() });
    localStorage.setItem("leads", JSON.stringify(leads));
    
    updateDashboard();
    hideAddLeadForm();
}

function displayLeads(tableId, filteredLeads = leads) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = "";

    filteredLeads.slice(0, 10).forEach((lead, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${lead.name}</td>
            <td>${lead.email}</td>
            <td>${lead.source}</td>
            <td>
                <span class="status-badge ${lead.status === 'New' ? 'new' : 'converted'}">
                    ${lead.status}
                </span>
            </td>
            <td>
                <button onclick="convertLead(${index})" class="action-btn convert">✓ Convert</button>
                <button onclick="deleteLead(${index})" class="action-btn delete">🗑 Delete</button>
            </td>
        `;
    });
}

function updateDashboard() {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === "New").length;
    const converted = leads.filter(l => l.status === "Converted").length;
    const conversionRate = total ? Math.round((converted / total) * 100) : 0;

    document.getElementById("totalLeads").textContent = total;
    document.getElementById("newLeads").textContent = newLeads;
    document.getElementById("convertedLeads").textContent = converted;
    document.getElementById("conversionRate").textContent = conversionRate + "%";

    // Update all lead tables
    const filteredLeads = currentFilter === 'All' ? leads : leads.filter(l => l.status === currentFilter);
    displayLeads("dashboardLeadTable", filteredLeads);
    displayLeads("leadsTable", filteredLeads);
}

function convertLead(index) {
    leads[index].status = "Converted";
    localStorage.setItem("leads", JSON.stringify(leads));
    updateDashboard();
}

function deleteLead(index) {
    if (confirm("Delete this lead permanently?")) {
        leads.splice(index, 1);
        localStorage.setItem("leads", JSON.stringify(leads));
        updateDashboard();
    }
}

function searchLeads() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    const filtered = leads.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.email.toLowerCase().includes(term)
    );
    displayLeads("dashboardLeadTable", filtered);
}

function filterByStatus(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById("searchInput").value = "";
    
    const filteredLeads = status === 'All' ? leads : leads.filter(l => l.status === status);
    displayLeads("dashboardLeadTable", filteredLeads);
    displayLeads("leadsTable", filteredLeads);
}

function showContent(section) {
    // Hide all content areas
    document.querySelectorAll('.content-area').forEach(area => {
        area.classList.remove('active');
    });
    
    // Remove active from all sidebar links
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected content and activate link
    document.getElementById(section + 'Content').classList.add('active');
    event.target.classList.add('active');
}

function showAddLeadForm() {
    document.getElementById("addLeadModal").style.display = "block";
}

function hideAddLeadForm() {
    document.getElementById("addLeadModal").style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("source").value = "";
}

// Close modal on click outside or ESC
window.onclick = function(event) {
    const modal = document.getElementById("addLeadModal");
    if (event.target === modal) hideAddLeadForm();
}

window.onkeydown = function(event) {
    if (event.key === "Escape") hideAddLeadForm();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
});
