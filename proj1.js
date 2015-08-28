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
      Meteor.call("addReparacao", titleVar, timeVar);
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
      //para colocar as repaçoes já realizadas para o fim da lista
      //a forma como o find funciona coloca no fim os checked
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
  addReparacao: function(titleVar, timeVar){
   ReparacoesCol.insert({
        title: titleVar,
        time: timeVar,
        createdAt: new Date(),
        owner: Meteor.userId()
      });
  },

  updateReparacao:function(id, checked){
    ReparacoesCol.update(id, {$set: {checked: checked}});
  },

  deleteReparacao: function(id){
    ReparacoesCol.remove(id);
  } ,
  //fazer set á repaçao como privada
  setPrivate: function(id, private) {
    //vai procurar a reparaçao especifica.
    var rep = ReparacoesCol.findOne(id);

    if(rep.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    ReparacoesCol.update(id, {$set: {private: private}});
  }
});