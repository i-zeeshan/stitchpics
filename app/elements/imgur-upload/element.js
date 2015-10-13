(function() {
  'use strict';
  /*jshint -W064 */
  Polymer({
  /*jshint +W064 */
    is: 'imgur-upload',

    properties: {
      uploadEndpoint: {
        type: String,
        value: 'https://api.imgur.com/3/image.json'
      },
      clientId: {
        type: String,
        value: '12a81bf09a70960'
      },
      url: {
        type: String
      },
      loading: {
        type: Boolean
      },
      urlHelper: {
        type: Object,
      },

      imagedata: {
        type: Array
      },
    },

    ready(){
      this.urlHelper = new UrlHelper();
    },

    openShareDialog(){
      this._uploadImage();
      this.loading = true;
      this.$.saveDialog.open();
    },


    _uploadImage(){
      fetch(this.uploadEndpoint, {
        method: 'post',
        mode: 'cors',
        headers: {
          "Authorization": 'Client-ID ' + this.clientId,
          "Accept": 'application/json',
          "Content-type": 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          image: this._getBase64FromImageData(this.imagedata).replace(/.*,/, ''),
          type: 'base64'
        })
      }).then((r)=> r.json())
      .then((data)=>{
        console.log(data);
        this.loading = false;
        this.url = this.urlHelper.buildUrl(data.data.id);
      }).catch((err)=>{
        console.log(err);
      });
    },

    _getBase64FromImageData(imageData){
      var canvas = document.createElement('canvas');
      canvas.height = imageData.height;
      canvas.width = imageData.width;
      var context = canvas.getContext('2d');
      context.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    },
  });
})();