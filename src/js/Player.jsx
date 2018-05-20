import preact from 'preact';
import cn from 'classnames';
import PlayerArt from './PlayerArt';
import PlayerControls from './PlayerControls';
import PlayerInfo from './PlayerInfo';
import '../scss/Player.scss';

export default class Player extends preact.Component {
  state = {
    isFullscreen: true,
    isPlaying: false,
  };

  componentDidUpdate() {
    if (!this.player) return;
    this.player.muted = this.props.trackLoading;
    this.player.onended = this.next;
    this.player.onpause = () => this.setState({ isPlaying: false });
    this.player.onplay = this.updateMediaSession;
    this.player.onplaying = () => this.setState({ isPlaying: true });
    this.player.onwaiting = () => this.setState({ isPlaying: true });
  }

  getCoverSize = (size = 512) => {
    if (!this.props.playlist) return;
    return this.props.playlist.cover + `&w=${size}&h=${size}`;
  };

  toggleFullscreen = () => {
    this.setState({ isFullscreen: !this.state.isFullscreen });
  };

  refresh = () => {
    ga('send', 'event', 'player', 'refresh');
    this.props.refresh();
  };

  play = () => {
    ga('send', 'event', 'player', 'play');
    this.player.play();
  };

  pause = () => {
    ga('send', 'event', 'player', 'pause');
    this.player.pause();
  };

  next = () => {
    ga('send', 'event', 'player', 'next');
    this.props.next();
  };

  skip = () => {
    ga('send', 'event', 'player', 'skip');
    this.props.skip();
  };

  updateMediaSession = () => {
    if ('mediaSession' in navigator) {
      const ms = navigator.mediaSession;

      const getCoverSizes = sizes => sizes.map(size => ({
        sizes: `${size}x${size}`,
        src: this.getCoverSize(size),
        type: 'image/jpeg',
      }));

      ms.metadata = new MediaMetadata({
        album: this.props.track.album,
        artist: this.props.track.artist,
        artwork: getCoverSizes([96, 128, 192, 256, 384, 512]),
        title: this.props.track.title,
      });

      ms.setActionHandler('nexttrack', this.props.skip);
    }
  };

  render() {
    const { deadEnd, track, trackLoading, visible } = this.props;
    const { isFullscreen, isPlaying } = this.state;

    return (
      <div
        className={cn({
          Player: true,
          fullscreen: isFullscreen,
          visible: visible,
        })}
      >
        <div className="Player_inner">
          <PlayerArt
            cover={this.getCoverSize()}
          />
          {track && <audio
            autoPlay={true}
            ref={player => this.player = player}
            src={track.stream}
            title={`${track.title} by ${track.artist}`}
          />}
          {!!deadEnd && !trackLoading && <div className="Player_error">
            No "{deadEnd}" playlists found.
          </div>}
          {track && <PlayerInfo
            artist={track.artist}
            loading={trackLoading}
            title={track.title}
          />}
          <PlayerControls
            disabled={!track}
            isFullscreen={isFullscreen}
            isPlaying={isPlaying}
            pause={this.pause}
            play={this.play}
            refresh={this.refresh}
            skip={this.skip}
            toggleFullscreen={this.toggleFullscreen}
          />
        </div>
      </div>
    );
  }
}
