/**
 * @author bhouston / http://exocortex.com
 */

module( "Plane" );

var comparePlane = function ( a, b, threshold ) {
	threshold = threshold || 0.0001;
	return ( a.normal.distanceTo( b.normal ) < threshold &&
	Math.abs( a.constant - b.constant ) < threshold );
};


test( "constructor", function() {
	var a = new THREE.Plane();
	ok( a.normal.x == 1, "Passed!" );
	ok( a.normal.y == 0, "Passed!" );
	ok( a.normal.z == 0, "Passed!" );
	ok( a.constant == 0, "Passed!" );

	a = new THREE.Plane( one3, 0 );
	ok( a.normal.x == 1, "Passed!" );
	ok( a.normal.y == 1, "Passed!" );
	ok( a.normal.z == 1, "Passed!" );
	ok( a.constant == 0, "Passed!" );

	a = new THREE.Plane( one3, 1 );
	ok( a.normal.x == 1, "Passed!" );
	ok( a.normal.y == 1, "Passed!" );
	ok( a.normal.z == 1, "Passed!" );
	ok( a.constant == 1, "Passed!" );
});

test( "copy", function() {
	var a = new THREE.Plane( new THREE.Vector3( x, y, z ), w );
	var b = new THREE.Plane().copy( a );
	ok( b.normal.x == x, "Passed!" );
	ok( b.normal.y == y, "Passed!" );
	ok( b.normal.z == z, "Passed!" );
	ok( b.constant == w, "Passed!" );

	// ensure that it is a true copy
	a.normal.x = 0;
	a.normal.y = -1;
	a.normal.z = -2;
	a.constant = -3;
	ok( b.normal.x == x, "Passed!" );
	ok( b.normal.y == y, "Passed!" );
	ok( b.normal.z == z, "Passed!" );
	ok( b.constant == w, "Passed!" );
});

test( "set", function() {
	var a = new THREE.Plane();
	ok( a.normal.x == 1, "Passed!" );
	ok( a.normal.y == 0, "Passed!" );
	ok( a.normal.z == 0, "Passed!" );
	ok( a.constant == 0, "Passed!" );

	var b = a.clone().set( new THREE.Vector3( x, y, z ), w );
	ok( b.normal.x == x, "Passed!" );
	ok( b.normal.y == y, "Passed!" );
	ok( b.normal.z == z, "Passed!" );
	ok( b.constant == w, "Passed!" );
});

test( "setComponents", function() {
	var a = new THREE.Plane();
	ok( a.normal.x == 1, "Passed!" );
	ok( a.normal.y == 0, "Passed!" );
	ok( a.normal.z == 0, "Passed!" );
	ok( a.constant == 0, "Passed!" );

	var b = a.clone().setComponents( x, y, z , w );
	ok( b.normal.x == x, "Passed!" );
	ok( b.normal.y == y, "Passed!" );
	ok( b.normal.z == z, "Passed!" );
	ok( b.constant == w, "Passed!" );
});

test( "setFromNormalAndCoplanarPoint", function() {
	var a = new THREE.Plane().setFromNormalAndCoplanarPoint( one3, zero3 );
	
	ok( a.normal.equals( one3.clone().normalize() ), "Passed!" );
	ok( a.constant == 0, "Passed!" );
});

test( "normalize", function() {
	var a = new THREE.Plane( new THREE.Vector3( 2, 0, 0 ), 2 );
	
	a.normalize();
	ok( a.normal.length() == 1, "Passed!" );
	ok( a.normal.equals( new THREE.Vector3( 1, 0, 0 ) ), "Passed!" );
	ok( a.constant == 1, "Passed!" );
});

test( "distanceToPoint", function() {
	var a = new THREE.Plane( new THREE.Vector3( 2, 0, 0 ), -2 );
	
	a.normalize();
	ok( a.distanceToPoint( a.projectPoint( zero3.clone() ) ) === 0, "Passed!" );
	ok( a.distanceToPoint( new THREE.Vector3( 4, 0, 0 ) ) === 3, "Passed!" );
});

test( "distanceToSphere", function() {
	var a = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );

	var b = new THREE.Sphere( new THREE.Vector3( 2, 0, 0 ), 1 );
	
	ok( a.distanceToSphere( b ) === 1, "Passed!" );

	a.set( new THREE.Vector3( 1, 0, 0 ), 2 );
	ok( a.distanceToSphere( b ) === 3, "Passed!" );
	a.set( new THREE.Vector3( 1, 0, 0 ), -2 );
	ok( a.distanceToSphere( b ) === -1, "Passed!" );
});

test( "projectPoint", function() {
	var a = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );

	ok( a.projectPoint( new THREE.Vector3( 10, 0, 0 ) ).equals( zero3 ), "Passed!" );
	ok( a.projectPoint( new THREE.Vector3( -10, 0, 0 ) ).equals( zero3 ), "Passed!" );

	a = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), -1 );
	ok( a.projectPoint( new THREE.Vector3( 0, 0, 0 ) ).equals( new THREE.Vector3( 0, 1, 0 ) ), "Passed!" );
	ok( a.projectPoint( new THREE.Vector3( 0, 1, 0 ) ).equals( new THREE.Vector3( 0, 1, 0 ) ), "Passed!" );
	
});

test( "orthoPoint", function() {
	var a = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );

	ok( a.orthoPoint( new THREE.Vector3( 10, 0, 0 ) ).equals( new THREE.Vector3( 10, 0, 0 ) ), "Passed!" );
	ok( a.orthoPoint( new THREE.Vector3( -10, 0, 0 ) ).equals( new THREE.Vector3( -10, 0, 0 ) ), "Passed!" );
});

/*
test( "isIntersectionLine", function() {
});
*/

test( "coplanarPoint", function() {
	var a = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );
	ok( a.distanceToPoint( a.coplanarPoint() ) === 0, "Passed!" );

	a = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), -1 );
	ok( a.distanceToPoint( a.coplanarPoint() ) === 0, "Passed!" );
});

test( "transform/translate", function() {

	var a = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );

	var m = new THREE.Matrix4();
	m.makeRotationZ( Math.PI * 0.5 );

	ok( comparePlane( a.clone().transform( m ), new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 ) ), "Passed!" );

	a = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), -1 );
	ok( comparePlane( a.clone().transform( m ), new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), -1 ) ), "Passed!" );

	m.makeTranslation( new THREE.Vector3( 1, 1, 1 ) );
	ok( comparePlane( a.clone().transform( m ), a.clone().translate( new THREE.Vector3( 1, 1, 1 ) ) ), "Passed!" );
});