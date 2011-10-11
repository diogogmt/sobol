<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<title>Table Styles | Slate Admin</title>	
	
	<!--Includes menu-->
        <?php require_once('../../components/external_files.php'); ?>
		
</head>

<body>
	
<div id="wrapper">
	
	<div id="header">
		<h1><a href="index2.html">Sobol Inc</a></h1>
		
		<div id="info">
			<h4>Welcome Archie</h4>
			
			<p>
				Logged in as Editdmin
				<br />
				You have <a href="javascript:;">5 messages</a>
			</p>
			
			<img src="../../images/avatar.jpg" alt="avatar" />
		</div> <!-- #info -->
				
	</div> <!-- #header -->	
	
	
		<!--Includes menu-->
		<?php require_once('../../components/menu.php'); ?>
                
	
	
	
	<div id="content" class="xfluid">
		
		<div class="portlet x12">
			<div class="portlet-header"><h4>Tables</h4></div>
			
			<div class="portlet-content">
				
				<br />

					
					<a name="plugin"></a>
					<h2>Customer Management</h2>
					<a href='customer_details.php'>
					<button class="btn">Add Customer</button>
					</a>
					<br />
					<br />
				
				<table cellpadding="0" cellspacing="0" border="0" class="display" rel="datatable" id="example">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Jobs pending</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>
						<tr class="odd gradeX">
							<td>Joe Doe</td>
							<td>joe@doe.com</td>
							<td>416 647-938</td>
							<td class="center"> 4</td>
							<td class="center"><a href='customer_details.php'>Edit</a></td>
						</tr>
						<tr class="even gradeC">
							<td>Pedo DiLara</td>
							<td>pedo@dilara.com</td>
							<td>416 647-938</td>
							<td class="center">1</td>
							<td class="center"><a href='customer_details.php'>Edit</a></td>
						</tr>
						<tr class="odd gradeEdit">
							<td>Trident</td>
							<td>Internet
								 Explorer 5.5</td>
							<td>416 647-938</td>
							<td class="center">0</td>
							<td class="center"><a href='customer_details.php'>Edit</a></td>
						</tr>
						<tr class="even gradeA">
							<td>Salci Fu</td>
							<td>salci@fu.com</td>
							<td>416 647-938</td>
							<td class="center">2</td>
							<td class="center"><a href='customer_details.php'>Edit</a></td>
						</tr>
						<tr class="odd gradeA">
							<td>Marie Doe</td>
							<td>marie@doe.com</td>
							<td>416 647-938</td>
							<td class="center">0</td>
							<td class="center"><a href='customer_detailst.php'>Edit</a></td>
						</tr>
					</tbody>
				</table>
				
				
				
				
				
				
				
			
			</div>
		</div>
		

		
	</div> <!-- #content -->
	
	
	<!--Includes footer-->
        <?php require_once('../../components/footer.php'); ?>
	
</div> <!-- #wrapper -->

	
</body>

</html>