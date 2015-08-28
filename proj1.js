ReparacoesCol = new Mongo.Collection('reparacoesCol');


if (Meteor.isClient) {

  Meteor.subscribe("reparacoesCol")  ;

  Template.body.helpers({
    reparacoes: function()
    {
      if (Session.get('hideFinished'))
        {
          return ReparacoesCol.find({checked: {$ne: true}});
        }
        else{
            return ReparacoesCol.find();
            }
    },
    hideFinished: function(){
      return session.Get('hideFinished');
    } 
  });

  Template.body.events({
    'submit .nova-reparacao': function(event){
      //vai buscar o valor do title e insere na variavel tittle
      var titleVar = event.target.titulo.value;
      var timeVar = event.target.tempo.value;
      var marcaVar = event.target.repMarca.value;
      var empregadoVar = event.target.repEmpregado.value;
      Meteor.call("addReparacao", titleVar, timeVar, marcaVar, empregadoVar);
      //Meteor.call("addReparacao", titleVar, timeVar);
    //coloca a form de novo em branco
    event.target.title.value = "";
    //para impedir q faça refresh da pagina
    return false;
    },

    'change .hide-finished': function(event){
      //vai criar esta session e colocar lá o valor que o checked tiver.
      Session.set('hideFinished', event.target.checked);
    }

    });


   Template.reparacao.events({
    'click .toggle-checked': function() {
      Meteor.call("updateReparacao", this._id, !this.private);
    },

    'click .delete': function()
    {
      Meteor.call("deleteReparacao",this._id);
    },

    'click .toggle-private': function() {
    //vai fazer a chamada ao servidor para mudar o valor da variavel "private"
    Meteor.call("setPrivate", this._id, !this.private);
    } 
     });

    Template.reparacao.helpers({
      isOwner: function(){
       return this.owner === Meteor.userId();
      }
    });
     //Para configurar para fazer login por username em vez de email
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("reparacoesCol", function(){
    //vai buscar as reparações que 
    return ReparacoesCol.find({
      $or: [
        //mostra as que não são privadas ou que seja o owner
        { private: {$ne: true} },
        { owner: this.userId}
      ]
    });
  });
}


Meteor.methods({
  addReparacao: function(titleVar, timeVar,marcaVar, empregadoVar){

   ReparacoesCol.insert({
        title: titleVar,
        time: timeVar,
        marca: marcaVar,
        empregado: empregadoVar,
        createdAt: moment().format("dddd, MMMM Do YYYY"),
        owner: Meteor.userId()
      });
  },

  updateReparacao:function(id, checked){
    var rep = ReparacoesCol.findOne(id);
    //caso não seja o dono da reparação vai dar erro
    if(rep.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    ReparacoesCol.update(id, {$set: {checked: checked}});
  },

  deleteReparacao: function(id){
    var rep = ReparacoesCol.findOne(id);
    //caso não seja o dono da reparação vai dar erro
    if(rep.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    ReparacoesCol.remove(id);
  } ,
  //fazer set á repaçao como privada
  setPrivate: function(id, private) {
    //vai procurar a reparaçao especifica.
    
    //aqui é onde muda o valor da variavel "private"
    ReparacoesCol.update(id, {$set: {private: private}});
  }
});