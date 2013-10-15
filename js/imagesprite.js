function ImageSprite(style, callback) {

    this.retina = window.devicePixelRatio == 2;

    this.img = new Image();
    this.img.src = this.retina ? style.sprite.retina : style.sprite.image;
    this.img.onload = function() {
        if (xhr.readyState === 4) callback();
    };

    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", style.sprite.positions, true);
    xhr.onload = function(e) {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
            that.position = JSON.parse(xhr.response);
            for (var p in that.position) {
                that.position[p].width *= window.devicePixelRatio;
                that.position[p].height *= window.devicePixelRatio;
                that.position[p].x *= window.devicePixelRatio;
                that.position[p].y *= window.devicePixelRatio;
            }
            if (that.img.complete) callback();
        }
    };
    xhr.send();

}

ImageSprite.prototype.bind = function(gl) {
    if (!this.texture) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);

    } else {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
};

ImageSprite.prototype.getDimensions = function() {
    var imagePixelRatio = window.devicePixelRatio / (this.retina ? 2 : 1);
    return [this.img.width * imagePixelRatio, this.img.height * imagePixelRatio];
};

ImageSprite.prototype.getPosition = function(name) {
    if (this.img.complete && this.position) {
        return this.position[name];
    }
};
