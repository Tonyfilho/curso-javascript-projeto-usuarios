class UserController {
  formEL ; // é um HTMLElement
  tableEL = []; // é um HTMLElement
  
  // Aqui no Controler vou receber o ID do CSS para pegar o Formulario
  constructor(formId, tableUserId) {
    //guardando o formulario em uma Variable
    this.formEL = document.getElementById(formId);
    /* OBS: Coleções HTML ou Elementos não aceitam usar o ForEach, temos que usar o SPREAD ou Object.entries
    Object.entries(this.formEL.elements).map(d => console.log(d[1])) ou
    [...this.formEL.elements].forEach    
    */
 
    this.tableEL = document.getElementById(tableUserId);
    this.onSubmit();
  }

  //***********************************************Metodo de SUBMETER o Formulario, Pego o ID do Formulario e Atuo no BOTÂO
  onSubmit() {
    let user;
    this.formEL.addEventListener("submit", (event) => {
        event.preventDefault(); //mudando o comportamento do Formulario para Não atualizar
        //atribuindo os valores para uma Var
      user = this.getValues();
      user.photo = ''; //sobre Escrevendo o Objeto fotos
    //   this.getPhoto((photo) => {user.photo = photo
    //     this.addLine(user);    
    // });
    this.getPhotoWithPromise().then((resultPhoto) => {
        user.photo = resultPhoto;
        this.addLine(user);
    }, (rejectErro) => {
       console.error(rejectErro);
    });


      });
  }
 //*********************************************Metodo para leitura de Arquivos vindo do PC, neste caso FOTOS, temos que passar um função de callback
  getPhoto(callback) {
      const fileReader = new FileReader();
      /**Pegando o campo da foto usando Spread e filter e ternario */
      let elementPhoto;
      let photoFile;
      [... this.formEL.elements].filter(element => { element.name == 'photo' ? elementPhoto = element: null });
      /**Pegando a Foto no Input e pondo em uma Var, Lembrando que Files é um Array de fotos, onde queremos o indice 0 */
      photoFile =  elementPhoto.files[0];      
      /**Tem que ter um Onload q retorna uma FUNCÃO 
       * o OnLoad, só é acdionando quando o readAsDataURL terninar de ler o arquivo e chamamos o Result
      */
      fileReader.onload = () => {
            callback(fileReader.result);// retornarei um função de callBack com parametro na linha 27
      };
      /**Tem que ReadAsDataURL recebe uma foto para transformar em Base64 e por mo SRC */
      fileReader.readAsDataURL(photoFile);
  }

  /** ****************************************Metodo para leitura de Arquivos vindo do PC usando PROMISES*/
   getPhotoWithPromise(){    
    const fileReader = new FileReader();
    let elementPhoto;
    let photoFile;
    return new Promise((resolve, reject) => {
        /**Pegando o campo da foto usando Spread e filter e ternario */
        [... this.formEL.elements].filter(element => { element.name == 'photo' ? elementPhoto = element: null });
        /**Pegando a Foto no Input e pondo em uma Var, Lembrando que Files é um Array de fotos, onde queremos o indice 0 */
        photoFile =  elementPhoto.files[0];      
        /**Tem que ter um Onload q retorna uma FUNCÃO 
         * o OnLoad, só é acdionando quando o readAsDataURL terninar de ler o arquivo e chamamos o Result
        */
        fileReader.onload = () => {
              resolve(fileReader.result);// retornarei um função de callBack com parametro na linha 27
        };
        fileReader.onerror = (e) => {
            reject(e);
        }
        /**Tem que ReadAsDataURL recebe uma foto para transformar em Base64 e por mo SRC */
        fileReader.readAsDataURL(photoFile);

    })
   }


  //***************************************************Metodo de pegar os valor para formulario e criar um Objeto User
  getValues() {
    let user = {};
    //usando Spread para Ler uma ELEMENTO Html [...this.blabla]
    [...this.formEL.elements].forEach((field) => {
      /*Criando o Objeto User
            O Gender é um SELECT, temos que checar quais as opcoes escolhidas*/
      if (field.name === "gender") {
        if (field.checked) {
          user[field.name] = field.value;
        }
      } else {
        user[field.name] = field.value;
      }
    });
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

  
/* Metodo q  adciona USUÁRIOS na TABLE exibida */
   addLine(dataUser) {
    // Mandando para TBody
    /**Pega o ID #"table-users" da tabela para mandar as  informações via AppendChild() */
    //InnerHTML fala p/ JS que este texto ´Não é uma STRING e sim um comando HTML
   this.tableEL.innerHTML = `   <tr>
    <td>
      <img
        src="${dataUser.photo}"
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
  }
  


}// end class
