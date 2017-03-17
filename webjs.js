
function led(){
	$.getJSON("leads.json", function(json) 
	{
			
		var data=json.leads; 
		var dict={};
		var dict2={};
		var dups_id=[];
		var dups_email=[];
		var output_unique=[];
		var output_idsame=[];
		var output_emailsame=[];		
		var j=0;
		for (var i=0;i<data.length;i++)
		{
			var s=data[i]._id
				if(s in dict)
					{
						dups_id[j]=dict[s];
						j++;
						dict[s]=i;
					}
				else 
					{
						dict[s]=i;
					}
		}
		j=0;
		for(var i in dict)
		{
			
			var s1=data[dict[i]].email;
				if(s1 in dict2)
					{
						dups_email[j]=dict2[s1];
						j++;
						dict2[s1]=dict[i];
					}
				else 
					{
						dict2[s1]=dict[i];
					}
			}

		for (var i in dict2)
		{
			output_unique.push(data[dict2[i]]);
		}

		
		for (var i in dups_id)
		{
				output_idsame.push(data[i]);

		}

		for (var i in dups_email)
		{
				output_emailsame.push(data[i]);

		}

			
	});
}
