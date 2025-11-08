
const resultDiv = document.getElementById('result');

document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);

    try {
        const response = await fetch('/images/upload', {
            method: 'POST',
            body: formData
        });

        const answer = await response.json();

        console.log(answer)

        resultDiv.innerHTML = `
          <p><strong>${answer.message}</strong></p>
          <p>Usuario: ${formData.get('username')}</p>
          <p>Password: ${formData.get('user_Password')}</p>
          <p>Email: ${formData.get('email')}</p>
          <p>Cellphone: ${formData.get('cellphone')}</p>
          <p>Ruta guardada: <code>${answer.filePath}</code></p>
          <img src="${answer.filePath}" width="300" style="border:1px solid #ccc; margin-top:10px;" />
        `;
    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = '<p style="color:red;">Error al subir la imagen.</p>';
    }
});