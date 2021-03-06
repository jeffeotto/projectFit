// avoid collisions
var FB_WP = FB_WP || {};
FB_WP.admin = FB_WP.admin || {};
FB_WP.admin.mentions = {
	friend_suggest: {hint:"Type to find a friend.",noresults:"No friend found.",stored_values:[]},
	page_suggest: {hint:"Type to find a page.",noresults:"No page found.",stored_values:[]},
	short_number: function(num) {
		if( num > 1000000 ) {
			return Math.round((num/1000000)).toString() + "m";
		} else if( num > 1000 ) {
			return Math.round((num/1000),0).toString() + "k";
		}

		return num;
	},
	token_input: { // loopj jquery-token-input
		friends: function() {
			jQuery("#suggest-friends").trigger("facebook-friends-mentions-onload").tokenInput(ajaxurl + "?" + jQuery.param({"action":"facebook_mentions_friends_autocomplete","autocompleteNonce":FBNonce.autocompleteNonce}), {
				theme: "facebook",
				preventDuplicates: true,
				hintText: FB_WP.admin.mentions.friend_suggest.hint,
				animateDropdown: false,
				noResultsText: FB_WP.admin.mentions.friend_suggest.noresults,
				onResult: function(results) {
					jQuery.each( results, function( index, friend ) {
						friend.uid = friend.id;
						friend.id = "[" + friend.id + "|" + friend.name + "]";
					} );
					return results;
				},
				prePopulate: FB_WP.admin.mentions.friend_suggest.stored_values,
				resultsFormatter: function(friend) {
					// we want at least a name
					if ( friend.name === undefined ) {
						return "";
					}
					var li = jQuery("<li />");
					// picture served in HTTP scheme
					// no mixed content just to make the list item pretty
					if ( friend.uid !== undefined ) {
						if ( document.location.protocol === "https:" ) {
							var photo = "https://graph.facebook.com/"+friend.uid+"/picture?width=25&height=25&return_ssl_resources=1";
						} else {
							var photo = "http://graph.facebook.com/"+friend.uid+"/picture?width=25&height=25";
						}
						li.append( jQuery("<img />").attr({width:25,height:25,src:photo,alt:friend.name}).css("margin-right","2em") );
					}
					li.append( jQuery("<span />").text(friend.name).text() );
					return jQuery("<ul />").append(li).html();
				}
			});
		},
		pages: function() {
			jQuery("#suggest-pages").trigger("facebook-pages-mentions-onload").tokenInput(ajaxurl + "?" + jQuery.param({"action":"facebook_mentions_pages_autocomplete","autocompleteNonce":FBNonce.autocompleteNonce}), {
				theme: "facebook",
				preventDuplicates: true,
				hintText: FB_WP.admin.mentions.page_suggest.hint,
				animateDropdown: false,
				minChars: 2,
				noResultsText: FB_WP.admin.mentions.page_suggest.noresults,
				onResult: function(results) {
					jQuery.each( results, function( index, page ) {
						page.uid = page.id;
						page.id = "[" + page.id + "|" + page.name + "]";
					} );
					return results;
				},
				prePopulate: FB_WP.admin.mentions.page_suggest.stored_values,
				resultsFormatter: function(page) {
					// we want at least a name
					if ( page.name === undefined ) {
						return "";
					}
					var li = jQuery("<li />");
					// account for no image or image inclusion causing mixed scheme
					if ( document.location.protocol === "http:" && page.image !== undefined ) {
						li.append( jQuery("<img />").attr({width:25,height:25,src:page.image,alt:page.name}).css("margin-right","2em") );
					}
					var text = page.name;
					if ( page.likes !== undefined ) {
						text = text + " (" + FB_WP.admin.mentions.short_number(page.likes) + " likes)";
					}
					li.append( jQuery("<span />").text(text).text() );
					return jQuery("<ul />").append(li).html();
				}
			});
		}
	},
	init: function() {
		FB_WP.admin.mentions.token_input.friends();
		FB_WP.admin.mentions.token_input.pages();
	}
};

jQuery(function() {
	FB_WP.admin.mentions.init();
});