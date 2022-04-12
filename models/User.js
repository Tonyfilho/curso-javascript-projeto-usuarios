class User {
  constructor(name, gender, birth, country, email, password, photo, admin) {
    this._id;
    this._name = name;
    this._gender = gender;
    this._birth = birth;
    this._country = country;
    this._email = email;
    this._password = password;
    this._photo = photo;
    this._admin = admin;
    this._register = new Date();
  }

  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }

  get gender() {
    return this._gender;
  }
  set gender(gender) {
    this._gender = gender;
  }

  get birth() {
    return this._birth;
  }
  set birth(birth) {
    this._birth = birth;
  }

  get country() {
    return this._country;
  }
  set country(country) {
    this._country = country;
  }

  get email() {
    return this._email;
  }
  set email(email) {
    this._email = email;
  }

  get password() {
    return this.password;
  }
  set password(password) {
    this._password = password;
  }

  get photo() {
    return this._photo;
  }
  set photo(photo) {
    this._photo = photo;
  }

  get admin() {
    return this._admin;
  }
  set admin(admin) {
    this._admin = admin;
  }

  get register() {
    return this._register;
  }
  set register(register) {
    this._register = register;
  }

  /** Recebe um Json e transforma em um Objeto User */
  loadFromJSON(json) {
    for (const key in json) {
      if (Object.hasOwnProperty.call(json, key)) {
        switch (key) {
          case "_register":
            this[key] = new Date(json[key]);
            break;
          default:
            this[key] = json[key];
        }
      }
    }
  }
  /** GetNewId é um Dummy gerador de Id */
  getNewId() {
    /**o ID por ser um Dummy terá que ser global com scopo global, para que o front tenha acesso, então vamos por ele
     * no WINDOWS, criaremos uma VAR no window chamada ID desta forma window.id
     */
    if (!window.id) {
      window.id = 0;
      /**Depois da Var window.ID criada, no window, posso somente chamar lá por ID, sem precisar de usar window.id  */
      id ++;
      return id;      
    } 
  }

  /** O Save irá salvar no local storage do navegador */
  saveLocalStorage() {
    let users = User.getUserStorage();
    if (this.id > 0) {
      users.map((user) => {
        if (user._id == this.id) {
          /**Se o User que vem do controler for igual o user da instancia, meclaremos com OBJECT.ASSIGN*/
          Object.assign(user, this);
        }
        return user;
      });
    } else {
      this.id = this.getNewId();
      users.push(this);// o THIS aqui é todo o OBJETO da class
    }
    /**Salvando no local Storage */
    localStorage.setItem("users", JSON.stringify(users));
  }

  /*******************Pega Todos os dados do Store**************** */
  static getUserStorage() {
    let users = [];
    /** O SessionStorage devolve uma STRING e não Objeto, Então tem q ser criado um OBJETO**/
    // o Set() recebe 2 paramentros, uma Key: e um Valor.
    // if (sessionStorage.getItem('users')) {
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }
    return users;
  }
}
