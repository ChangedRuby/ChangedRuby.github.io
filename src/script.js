console.log("Hello website!");

const sidebar = document.getElementById('sidebar');
const sidebar_icon = document.getElementById('sidebar-icon');
var animated = document.querySelector('.normal_header');

animated.addEventListener('animationend', (e) => {
    console.log('Animation ended');

    if(e.animationName == 'sidebar-close'){
        sidebar.style.display = 'none';
    }

    if(e.animationName == 'sidebar-open'){
        sidebar_icon.style.display = 'none';
    }
});

function handleEvent(event){
    console.log('Event type:', event.animationName);
}

function sidebarOpen(){
    sidebar.style.display = 'block';
    sidebar.classList.add('sidebar_open');
    sidebar.classList.remove('sidebar_close');
}

function sidebarClose(){
    sidebar_icon.style.display = 'block';
    sidebar.classList.add('sidebar_close');
    sidebar.classList.remove('sidebar_open');
}