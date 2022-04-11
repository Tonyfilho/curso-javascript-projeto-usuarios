class UserController {
  formEL; // é um HTMLElement para Formulario ADD
  formUpdateEL; // é o HTMLElemento para Formulario de UPDATE
  tableEL = []; // é um HTMLElement

  // Aqui no Controler vou receber o ID do CSS para pegar o Formulario
  constructor(formIdCreate, formIdUpdate, tableUserId) {
    //guardando o formulario em uma Variable
    this.formEL = document.getElementById(formIdCreate);
    this.formUpdateEL = document.getElementById(formIdUpdate);

    /* OBS: Coleções HTML ou Elementos não aceitam usar o ForEach, temos que usar o SPREAD ou Object.entries
    Object.entries(this.formEL.elements).map(d => console.log(d[1])) ou
    [...this.formEL.elements].forEach    
    */

    this.tableEL = document.getElementById(tableUserId);
    this.onSubmit();
    this.onEdit();
    this.selectAll();
  }
  //***********************************************Metodo de onEditeCancel() esconde o FOrm de Editar e mostra o de Salvar
  onEdit() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPanelCreate();
      });

    //acessando formulario de update Igual ao onSubmit()
    this.formUpdateEL.addEventListener("submit", (event) => {
      event.preventDefault();
      const btn = this.formUpdateEL.querySelector("[type=submit]");
      btn.disabled = true;
      let valueUserUpdate = this.getValues(this.formUpdateEL);
      // console.log('Teste ValueUserUpdate ',valueUserUpdate);
      //**Passando o Index da TD capturada na tr.dataset.trIndex para.. e passando para TR da tabela na linha 38*/
      let index = this.formUpdateEL.dataset.trIndex;
      let tr = this.tableEL.rows[index];
      /**Vamos substituir o Objeto atual q tem a voto, pelo Objeto do Update,
       * para isto guardaremos o antigo em uma foto e usaremos  Objecto.assign() para juntar
       * os Objetos e substituir o antigo pelo novo
       */
      let userOld = JSON.parse(tr.dataset.user);
      let result = Object.assign({}, userOld, valueUserUpdate);
      // console.log(result);
       
      this.getPhotoWithPromise(this.formUpdateEL).then(
        (resultPhoto) => {
          if (!valueUserUpdate.photo) {
            result._photo = userOld._photo;
          } else {
            result._photo = resultPhoto;
          }
          tr.dataset.user = JSON.stringify(result);
          /**Mudando a TR com os valores Add para Update, usando InnerHTML */
          tr.innerHTML = ` 
          <td>
            <img
              src="${result._photo}"
              alt="User Image"
              class="img-circle img-sm"
            />
          </td>
          <td>${result._name}</td>
          <td>${result._email}</td>
          <td>${result._admin ? "Yes" : "No"}</td>
          <td>${Utils.dateFormat(result._register)}</td>
          <td>
            <button
              type="button"
              class="btn btn-primary btn-edit btn-xs btn-flat"
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
        `;
          this.addEventsTR(tr);
          this.updateCount();
          this.formUpdateEL.reset();
          btn.disabled = false;
          this.showPanelCreate();
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  //***********************************************Metodo de SUBMETER o Formulario, Pego o ID do Formulario e Atuo no BOTÂO
  onSubmit() {
    let user;
    this.formEL.addEventListener("submit", (event) => {
      event.preventDefault(); //mudando o comportamento do Formulario para Não atualizar
      //atribuindo os valores para uma Var
      //Pegando o botão do formulario para
      const btn = this.formEL.querySelector("[type=submit]");
      btn.disabled = true;

      user = this.getValues(this.formEL);
      if (!user) {
        return false;
      }
      user.photo = ""; //sobre Escrevendo o Objeto fotos
      //   this.getPhoto((photo) => {user.photo = photo
      //     this.addLine(user);
      // });
      this.getPhotoWithPromise(this.formEL).then(
        (resultPhoto) => {
          user.photo = resultPhoto;
          this.insert(user);
          this.addLine(user);
          this.formEL.reset();
          btn.disabled = false;
        },
        (rejectErro) => {
          console.error(rejectErro);
        }
      );
    });
  }
  //*********************************************Metodo para leitura de Arquivos vindo do PC, neste caso FOTOS, temos que passar um função de callback
  getPhoto(callback) {
    const fileReader = new FileReader();
    /**Pegando o campo da foto usando Spread e filter e ternario */
    let elementPhoto;
    let photoFile;
    [...this.formEL.elements].filter((element) => {
      element.name == "photo" ? (elementPhoto = element) : null;
    });
    /**Pegando a Foto no Input e pondo em uma Var, Lembrando que Files é um Array de fotos, onde queremos o indice 0 */
    photoFile = elementPhoto.files[0];
    /**Tem que ter um Onload q retorna uma FUNCÃO
     * o OnLoad, só é acdionando quando o readAsDataURL terninar de ler o arquivo e chamamos o Result
     */
    fileReader.onload = () => {
      callback(fileReader.result); // retornarei um função de callBack com parametro na linha 27
    };
    /**Tem que ReadAsDataURL recebe uma foto para transformar em Base64 e por mo SRC */
    fileReader.readAsDataURL(photoFile);
  }

  /** ****************************************Metodo para leitura de Arquivos vindo do PC usando PROMISES*/
  getPhotoWithPromise(formEL) {
    const fileReader = new FileReader();
    let elementPhoto;
    let photoFile;
    return new Promise((resolve, reject) => {
      /**Pegando o campo da foto usando Spread e filter e ternario */
      [...formEL.elements].filter((element) => {
        element.name == "photo" ? (elementPhoto = element) : null;
      });
      /**Pegando a Foto no Input e pondo em uma Var, Lembrando que Files é um Array de fotos, onde queremos o indice 0 */
      photoFile = elementPhoto.files[0];
      /**Tem que ter um Onload q retorna uma FUNCÃO
       * o OnLoad, só é acdionando quando o readAsDataURL terninar de ler o arquivo e chamamos o Result
       */
      fileReader.onload = () => {
        resolve(fileReader.result); // retornarei um função de callBack com parametro na linha 27
      };
      fileReader.onerror = (e) => {
        reject(e);
      };
      /**Tem que ReadAsDataURL recebe uma foto para transformar em Base64 e por mo SRC */
      if (photoFile) {
        fileReader.readAsDataURL(photoFile);
      } else {
        return resolve("dist/img/boxed-bg.jpg");
      }
    });
  }

  //***************************************************Metodo de pegar os valor para formulario e criar um Objeto User
  getValues(formEL) {
    let user = {};
    let isValid = true;
    //usando Spread para Ler uma ELEMENTO Html [...blabla]
    [...formEL.elements].forEach((field) => {
      /*Criando o Objeto User form-control is-invalid
            O Gender é um SELECT, temos que checar quais as opcoes escolhidas*/

      if (
        ["name", "password", "email"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        /**Para adcionar o erro, tenho q pegar o ELEMENTO PAI e adcionar uma class aqui dentro for */
        field.parentElement.classList.add("has-error");
        isValid = false;
      }
      if (field.name === "gender") {
        if (field.checked) {
          user[field.name] = field.value;
        }
      } else if (field.name === "admin") {
        user[field.name] = field.checked;
      } else {
        user[field.name] = field.value;
      }
    });

    if (!isValid) {
      return false; // parando o envio do formulario caso haja campos com erros
    }
    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
  }
  /*******************Pega Todos os dados do Store**************** */
  getUserStorage() {
    let users = [];
    /** O SessionStorige devolve uma STRING e não Objeto, Então tem q ser criado um OBJETO**/
    // o Set() recebe 2 paramentros, uma Key: e um Valor.
    if (sessionStorage.getItem('users')) {
      users = JSON.parse(sessionStorage.getItem('users'));
          
    }
    return users;
  }
  /***************Seleciona todo os Users do Store  */
  selectAll(){
    let users = this.getUserStorage();
    users.forEach(dataUser => {
     let user = new User();
     user.loadFromJSON(dataUser);
     this.addLine(user);
    });

  }
  /**********************Insert(), pega os dados  SecctionStorige*/
  insert(dataUser){
    let users = this.getUserStorage();
    users.push(dataUser);// passamos uma Array por se tratar de um Objeto com mais de uma KEY
    sessionStorage.setItem('users', JSON.stringify(users));

  
  } 
  /* Metodo q  adciona USUÁRIOS na TABLE exibida */
  addLine(dataUser) {
    const tr = document.createElement("tr");
    tr.dataset.user = JSON.stringify(dataUser); //criando um DataSet para ter acesso ao numero de admin
    // Mandando para TBody
    /**Pega o ID #"table-users" da tabela para mandar as  informações via AppendChild() */
    /*InnerHTML fala p/ JS que este texto ´Não é uma STRING e sim um comando HTML, 
    lembrado que ele Inner SUBSTITUI o ultimo evento, caos precise de um Array, 
    temos que criar o compomente TR para cada linha*/
    tr.innerHTML = ` 
    <td>
      <img
        src="${dataUser.photo}"
        alt="User Image"
        class="img-circle img-sm"
      />
    </td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${dataUser.admin ? "Yes" : "No"}</td>
    <td>${Utils.dateFormat(dataUser.register)}</td>
    <td>
      <button
        type="button"
        class="btn btn-primary btn-edit btn-xs btn-flat"
      >
        Editar
      </button>
      <button
        type="button"
        class="btn btn-danger btn-delete btn-xs btn-flat"
      >
        Excluir
      </button>
    </td>
  `;
    this.addEventsTR(tr);
    /** AppendChild adciona o Element TR na tabela */
    this.tableEL.appendChild(tr);
    this.updateCount();
  }
  /**************************Evento da TR************************ */
  addEventsTR(tr) {
    /**Caso haja um evento no botão Delete() este metodo é acionado. */
    this.deleteTr(tr);
    /**Pegando o Botão Edite pela class */
    let jSon;
    // let formUpdate;
    tr.querySelector(".btn-edit").addEventListener("click", (e) => {
      jSon = JSON.parse(tr.dataset.user);
      // formUpdate = document.querySelector("#form-user-update");

      /**Pegando Index da ROW da TR no momento do click */
      this.formUpdateEL.dataset.trIndex = tr.sectionRowIndex;

      for (const key in jSon) {
        if (Object.hasOwnProperty.call(jSon, key)) {
          // const element = jSon[key];
          let field = this.formUpdateEL.querySelector(
            "[name=" + key.replace("_", "") + "]"
          );
          if (field) {
            switch (field.type) {
              case "file":
                continue;
                break;
              case "radio":
                // se for Radio button, pego o Value pelo nome selecionado, e adciono TRUE
                field = this.formUpdateEL.querySelector(
                  "[name=" + key.replace("_", "") + "][value=" + jSon[key] + "]"
                );
                field.checked = true;
                break;
              case "checkbox":
                field.checked = jSon[key];
                break;
              default:
                field.value = jSon[key];
            }
          }
        }
      }
      /**Pegando o campo Photo pela class no form Update, e trocar o atributo SRC */
      this.formUpdateEL.querySelector(".photo").src = jSon._photo;
      this.showPanelUpdate();
    });
  }

  /******************************DeleteTr  remove a linha  */
  deleteTr(tr){
   tr.querySelector('.btn-delete').addEventListener('click', event => {
   if(confirm('Are you sure ??')) {
      tr.remove();
      this.updateCount();

   }

   })
  }

  /**Pegando o Botão Edite os Style da div */
  showPanelCreate() {
    document.querySelector("#box-user-create").style.display = "block";
    document.querySelector("#box-user-update").style.display = "none";
  }
  /**Pegando o Botão Edite os Style da div */
  showPanelUpdate() {
    document.querySelector("#box-user-create").style.display = "none";
    document.querySelector("#box-user-update").style.display = "block";
  }

  updateCount() {
    let numberUser = 0;
    let numberAdmin = 0;

    [...this.tableEL.children].forEach((tr) => {
      numberUser++; //Adcionando numero de User
      //JSON.parse() transforma uma string em JSON
      let userAdmin = JSON.parse(tr.dataset.user);
      if (userAdmin._admin) {
        numberAdmin++;
      }
    });
    //Mandando o valor para templates, usando querySelector e o InnerHtml
    document.querySelector("#number-users").innerHTML = numberUser;
    document.querySelector("#number-users-admin").innerHTML = numberAdmin;
  }
} // end class
