/**
 * CrossFade Gallery - Image gallery for jQuery
 * Written by Akop Kesheshyan
 * Twitter: http://twitter.com/creativator_ru
 *
 * @author Creativator Media
 * @site http://creativator.net/
 * @version 0.9.6
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
				width:640,
				height:480,
				controls:{},
				tooltips:{},
				thumbnails:{
					handle:false,
					size:50
				},
				stopOnHover:true,
				onLoad:false,
				onChange:false
			},
			init: function($this, $settings){				
				this.object = $this;					
				this.settings = $.extend(this.settings,$settings);				
							
				$(this.object).css({listStyle:'none',margin:0,padding:0,position:'relative',overflow:'hidden',width:this.settings.width+'px',height:this.settings.height+'px'});
				
				var $size = $('li',this.object).length;
				
				$('li',this.object).each(function(i){ $(this).css({position:'absolute',zIndex:$size-i}); }).filter(':first').addClass('active');
				
				if(this.settings.controls){
					$(this.object).parent().append(
						$controls = $('<a href="#prevImage" class="cf_controls prevImage">prevImage</a><a href="#nextImage" class="cf_controls nextImage">nextImage</a>').css({
								position:'absolute',
								zIndex:800,
								height:'38px',
								width:'20px',
								overflow:'hidden',
								textIndent:'-9999px',
								background:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAABGCAIAAABDrSOmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANVJREFUeNrs1jEKwyAYBeBAV6dAwCMFMuY4Tt4gV3LJLILglBvkABnEPiiE0im+QKvFNwQdPpzy/6/r6ogQ4v36uC6llOu69n1vjMl7E9J7n1IKIXy8f1Xii/PfymEYKpU4ly+dc6Tcto2RiLUWct/3bInM8xxjhF+WhfnLx3E8jqP55iv30zSRXinVtZTWNzKitc7eTOebaBrMZjv3+F1PbtbyPLO9avd81yjMo72QHr0FHh0mG2PiQ6K9oMMwEnMf07vJJr8r0TRI+Qr6Bil/kKcAAwBnuNaJygDpBAAAAABJRU5ErkJggg%3D%3D) #000 no-repeat',
								backgroundPosition:'',
								marginTop:'-'+((this.settings.height/2)+40)+'px'}).click(function(){
										if($(this).hasClass('nextImage')){
											$.crossFadeGallery.nextImage();
											}else if($(this).hasClass('prevImage')){
												$.crossFadeGallery.prevImage();
											}
										return false;
									})
					);
					
					$controls.filter('.nextImage')
						.css({
							marginLeft:(this.settings.width-20)+'px',
							backgroundPosition:'0 -35px'});
				}
				
				if(this.settings.tooltips){
					var $width = this.settings.width;
					var $height = this.settings.height;
					$('li',this.object).each(function(i){
						$(this).prepend(
							$('<div id="tooltip-'+i+'" class="cf_tooltip"></div>')
								.css({
								width:($width-10)+'px',
								padding:'10px',
								position:'absolute',
								background:'#000',
								zIndex:900+($size-i),
								color:'#fff'})
									.html($('img',this).attr('title'))
						);
					});
					
				}
				
				if(this.settings.thumbnails){
					if(!this.settings.thumbnails.handle){
						$(this.object).parent().append($thumbnails = $('<div id="cf_thumbnails"><ul></ul></div>'));
						var thumb_size = this.settings.thumbnails.size;
							$('li img',this.object).each(function(i){
								$('ul',$thumbnails).append('<li><a href="#" rel="'+i+'"><img class="cf_thumbnail" height="'+thumb_size+'" src="'+$(this).attr('src')+'" alt="" /></a></li>'); 
							});
					}else{
						var $thumbnails = $(this.settings.thumbnails.handle);
					}
						
						$thumbnails.css({
							width:(this.settings.width-10)+'px',
							background:'#000',
							overflow:'hidden',
							padding:'5px',
							position:'absolute',
							zIndex:1000,
							marginTop:'-'+(this.settings.thumbnails.size + 10)+'px'
							}).find('ul').css({
								listStyle:'none',
								margin:0,
								padding:0,
								width:((this.settings.thumbnails.size+10)*$size)+'px'
								}).find('li').css({
										'float':'left',
										marginRight:'10px',
										width:this.settings.thumbnails.size+'px',
										height:this.settings.thumbnails.size+'px',
										overflow:'hidden'
										}).find('a').click(function(){
											$.crossFadeGallery.stopSlideShow()
												$.crossFadeGallery.setImage($(this).attr('rel'));
											$.crossFadeGallery.playSlideShow();
											return false;
										});
										
				}
				
				
				this.playSlideShow();
				
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
				this.stopSlideShow();
				if(this.settings.auto){
					if(this.settings.stopOnHover){
						$(this.object).hover(function(){
							$.crossFadeGallery.stopSlideShow();
						},function(){
							$.crossFadeGallery.playSlideShow();
						});
					}
					
					this.timer = window.setTimeout(function(){
						$.crossFadeGallery.playSlideShow(); 
						$.crossFadeGallery.nextImage();
					},$.crossFadeGallery.settings.auto*1000);
				}
			}
		}
	});
	
	$.extend($.fn, {
		crossFadeGallery: function(settings){
			$.crossFadeGallery.init(this,settings);
		}
	});	


})(jQuery);