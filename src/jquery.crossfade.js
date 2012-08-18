/**
 * CrossFade Gallery - Image gallery for jQuery
 * Written by Akop Kesheshyan
 * Twitter: http://twitter.com/creativator_ru
 *
 * @author Creativator Media
 * @site http://creativator.net/
 * @version 0.9.2
 *
 **/
(function($){		
	$.extend({
		crossFadeGallery:{
			object:{},
			offset:0,
			timer:true,
			settings:{
				speed: 1000,
				auto: 5,
				width:'640px',
				height:'480px',
				stopOnHover:true,
				onLoad:false,
				onChange:false
			},
			init: function($this, $settings){				
				this.object = $this;					
				this.settings = $.extend(this.settings,$settings);				
							
				$(this.object).css({listStyle:'none',margin:0,padding:0,position:'relative',overflow:'hidden',width:this.settings.width,height:this.settings.height});
				
				var $size = $('li',this.object).length;
				
				$('li',this.object).each(function(i){ $(this).css({position:'absolute',zIndex:$size-i}); }).filter(':first').addClass('active');
				
				if(this.settings.auto){
					if(this.settings.stopOnHover){
						$(this.object).hover(function(){
							$.crossFadeGallery.stopSlideShow();
						},function(){
							$.crossFadeGallery.playSlideShow();
						});
					}					
					this.playSlideShow();
				}				
				
				if($.isFunction(this.settings.onLoad)){
					return this.settings.onLoad(this);
				}
			},
			nextImage: function(){
				($('.active',this.object).next().size())? this.setImage(this.offset + 1):this.setImage(0);				
			},
			prevImage: function(){
				($('.active',this.object).prev().size())? this.setImage(this.offset - 1):this.setImage(0);
			},
			setImage:function(offset){				
						
				if(this.offset < offset){
					$('li',this.object).each(function(i){
						if($.crossFadeGallery.offset != i && i < offset){
							$(this).hide();
						}
					});
					
					$('.active',this.object).fadeOut(this.settings.speed,function(){
						$(this).removeClass('active');
							$($('li',$.crossFadeGallery.object)[offset]).addClass('active');
						$.crossFadeGallery.offset = offset;
					});	
					
				}
				
				if(this.offset > offset){
					$($('li',this.object)[offset]).fadeIn(this.settings.speed,function(){
						$('.active',$.crossFadeGallery.object).removeClass('active');
							$(this).addClass('active').nextAll().show();
						$.crossFadeGallery.offset = offset;
					});
				}
				
				if($.isFunction(this.settings.onChange)){
					return this.settings.onChange(offset, this);
				}		
			},
			stopSlideShow:function(){ 
				if(this.timer) window.clearTimeout(this.timer);
			},
			playSlideShow:function(){
				this.timer = window.setTimeout(function(){
					$.crossFadeGallery.playSlideShow(); 
					$.crossFadeGallery.nextImage();
				},$.crossFadeGallery.settings.auto*1000);
			}
		}
	});
	
	$.extend($.fn, {
		crossFadeGallery: function(settings){
			$.crossFadeGallery.init(this,settings);
		}
	});	


})(jQuery);