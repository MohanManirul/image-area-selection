const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

let img = new Image();
let isDragging = false;
let startX, startY, endX, endY;
let selections = [];

// ইমেজ লোড করা
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
    };

    reader.readAsDataURL(file);
});

// মাউস ডাউন ইভেন্ট
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
});

// মাউস মুভ ইভেন্ট
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // সকল সিলেকশন আঁকা
    selections.forEach(selection => {
        ctx.strokeStyle = selection.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(selection.startX, selection.startY, selection.width, selection.height);
    });

    // নতুন সিলেকশন
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
});

// মাউস আপ ইভেন্ট
canvas.addEventListener('mouseup', (e) => {
    isDragging = false;

    const newSelection = {
        startX,
        startY,
        width: endX - startX,
        height: endY - startY,
        color: getRandomColor() // আলাদা রঙ তৈরি করুন
    };

    selections.push(newSelection);
    drawSelections();
    console.log(selections); // `selections` অ্যারে প্রদর্শন করা হয়েছে
});

// ডাবল ক্লিক ইভেন্ট
canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // সিলেকশন খুঁজে ডিলিট করুন
    selections = selections.filter(selection => {
        const withinX = clickX >= selection.startX && clickX <= selection.startX + selection.width;
        const withinY = clickY >= selection.startY && clickY <= selection.startY + selection.height;
        return !withinX || !withinY;
    });

    drawSelections();
    console.log(selections); // `selections` অ্যারে প্রদর্শন করা হয়েছে
});

// ক্যানভাসে সকল সিলেকশন আঁকুন
function drawSelections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);

    selections.forEach(selection => {
        ctx.strokeStyle = selection.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(selection.startX, selection.startY, selection.width, selection.height);
    });
}

// র্যান্ডম রঙ তৈরি করুন
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
