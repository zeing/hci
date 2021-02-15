$(function(){

			$('#navMain ul.navSub').parent().hover(function(){
					$(this).addClass('hover');
					$('.navSub',this).show();
					$('.bgHover').css({
						'display':'block',
						'opacity':0
					}).stop().fadeTo(800,1,"easeOutExpo");
			},function(){
						$(this).removeClass('hover');
						$('.navSub',this).hide();
						$('.bgHover').css({'display':'none'});
			});
			
			fnTotalItem();

});


function fnTotalItem(){
	var ROOT=$("input#ROOT").val();
	$.ajax({
			  type: "POST",
			  url: ROOT+"shop/lib/totalitem.php",
			  cache: false,
			  data: '',
			  success: function(response){
					$('#totalitem').html(response);
			  }
	});
}