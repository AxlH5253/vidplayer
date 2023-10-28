import { Component, ElementRef, QueryList, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import data from './../../assets/feed.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  feed = data;
  @ViewChildren('player')videoPlayers!: QueryList<any>;

  currentPlaying: any = null;

  stickyVideo: HTMLVideoElement | any = null;
  stickyPlaying = false;

  @ViewChild('stickyplayer', { static: false }) stickyPlayer!: ElementRef;

  constructor(
    private renderer: Renderer2
  ) {}

  didScroll(event: any){
    if(this.currentPlaying && this.isElementInViewport(this.currentPlaying)){
      return;
    }else if(this.currentPlaying && !this.isElementInViewport(this.currentPlaying)){
      this.currentPlaying.pause();
      this.currentPlaying = null;
    }

    this.videoPlayers.forEach(player => {
      if(this.currentPlaying) return;

      const nativeElement = player.nativeElement;
      const inView = this.isElementInViewport(nativeElement);

      if(this.stickyVideo && this.stickyVideo.src == nativeElement.src){
        return;
      }

      if(inView){
        this.currentPlaying = nativeElement;
        this.currentPlaying.muted = true;
        this.currentPlaying.play();
      }
    });
  }

  openFullScreen(elem: any, sticky: boolean){
    if(elem.requestFullScreen){
      elem.requestFullScreen();
    }else if(elem.webkitEnterFullScreen){
      elem.webkitEnterFullScreen();
      elem.enterFullScreen();
    }
    if(sticky){
      this.stickyVideo.muted = false;
    }else{
      this.currentPlaying.muted = false;
    }
  }

  isElementInViewport(el: any){
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  playOnSide(elem: any){
    if(this.stickyVideo){
      this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
    }

    this.stickyVideo = elem.cloneNode(true);
    this.renderer.appendChild(this.stickyPlayer.nativeElement, this.stickyVideo);

    if(this.currentPlaying){
      const playPosition = this.currentPlaying.currentTime;
      this.currentPlaying.pause();
      this.currentPlaying = null;
      this.stickyVideo.currentTime = playPosition;
    }

    this.stickyVideo.muted = false;
    this.stickyVideo.play();
    this.stickyPlaying = true;
  }

  closeSticky(){
    if(this.stickyPlayer){
      this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
      this.stickyVideo = null;
      this.stickyPlaying = false;
    } 
  }

  playOrPauseSticky(){
    if(this.stickyPlaying){
      this.stickyVideo.pause();
      this.stickyPlaying = false;
    }else{
      this.stickyVideo.play();
      this.stickyPlaying = true;
    }
  }

  setVolume(){
    if(this.currentPlaying){
      this.currentPlaying.muted = !this.currentPlaying.muted;
    }
  }

  onChangeVideoToPlay(elem: any){
    if(this.currentPlaying && this.currentPlaying != elem){
      this.currentPlaying.pause();
      this.currentPlaying = null;
      this.currentPlaying = elem;
      this.currentPlaying.muted = false;
      this.currentPlaying.play();
    }else if(this.currentPlaying){
      this.currentPlaying.muted = false;
      if(this.currentPlaying.paused){
        this.currentPlaying.play();
      }else{
        this.currentPlaying.pause();
      }
    }else{
      this.currentPlaying = elem;
      this.currentPlaying.play();
    }
  }

}
