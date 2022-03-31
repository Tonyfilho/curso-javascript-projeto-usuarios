// var gender = document.querySelectorAll('#form-user-create [name=gender]:checked');//navega pelao formulario e traz o q foi escolhido
//Criando o Objeto e pegando todos os campos do formulario
var fieldForm = document.querySelectorAll("#form-user-create [name]");
var user = {};
var users = [];

/* funcção de adciona USUÁRIOS na Lista */
function addLine(dataUser) {
  // criando a TR
  const tr = document.createElement("tr");
  //InnerHTML fala p/ JS que este texto ´Não é uma STRING e sim um comando HTML
  tr.innerHTML = `   <tr>
  <td>
    <img
      src="dist/img/user1-128x128.jpg"
      alt="User Image"
      class="img-circle img-sm"
    />
  </td>
  <td>${dataUser.name}</td>
  <td>${dataUser.email}</td>
  <td>${dataUser.admin}</td>
  <td>${dataUser.birth}</td>
  <td>
    <button
      type="button"
      class="btn btn-primary btn-xs btn-flat"
    >
      Editar
    </button>
    <button
      type="button"
      class="btn btn-danger btn-xs btn-flat"
    >
      Excluir
    </button>
  </td>
</tr>`;
 /**Pega o ID da tabela para mandar as  informações via AppendChild() */
 document.getElementById('table-users').appendChild(tr);
}

/**Pegando dados que VEEM pelo BOTÃO do Submit e mandando para fieldForm */
document
  .getElementById("form-user-create")
  .addEventListener("submit", (event) => {
    event.preventDefault(); //mudando o comportamento do Formulario para Não atualizar
    /**Atribuindo VALORES nos campos do formularios */
    this.fieldForm.forEach((field) => {
      if (field.name === "gender") {
        if (field.checked) {
          this.user[field.name] = field.value;
        }
      } else {
        this.user[field.name] = field.value;
      }
    });

    this.addLine(this.user);
    console.log(this.user);
  });
