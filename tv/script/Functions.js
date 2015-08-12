var ChannelParameters = function () {
    try {
        volume = SoundSettings.getVolumeLevel();
    }
    catch (err) {
        volume = 0;
    }
    

};

ChannelParameters.prototype.getVolume = function () {
    volume = SoundSettings.getVolumeLevel();
    return volume;
};
ChannelParameters.prototype.setVolume = function (volume) {
    volume = volume;
    SoundSettings.getVolumeLevel(volume);
};
ChannelParameters.prototype.increaseVolume = function () {
    volume += 1;
    SoundSettings.setVolumeLevel(volume);
};
ChannelParameters.prototype.decreaseVolume = function () {
    volume -= 1;
    SoundSettings.setVolumeLevel(volume);
};