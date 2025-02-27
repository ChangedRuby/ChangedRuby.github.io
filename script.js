console.log("Hello website!");

const sidebar = document.getElementById('sidebar');
const sidebar_icon = document.getElementById('sidebar-icon');

function sidebarOpen(){
    sidebar.style.display = 'block';
    sidebar_icon.style.display = 'none';
}

function sidebarClose(){
    sidebar.style.display = 'none';
    sidebar_icon.style.display = 'block';
}