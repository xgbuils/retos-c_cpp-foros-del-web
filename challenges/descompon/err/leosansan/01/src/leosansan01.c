// Autor: leosansan
// Fecha: 17/12/2014 13:19
// Enlace: http://www.forosdelweb.com/f96/petando-pila-problemas-retos-usando-recursividad-1113701/index4.html#post4663732

#include <stdio.h>
/* 
int descompon ( int a , int b  , int ver ) ;
int factorizar1 (  int i , int numero , int b , int ver ) ;
void factorizar2 (  int i , int *n , int b , int ver  ) ;
void imprimir( int i , int n, int b  , int ver ) ;
 
int main ( void ) {
    int ver;
    return descompon ( 1500 , 1550,  ver ) , 0 ;
}*/
 
int descompon ( int a , int b , int ver ) {
  if ( a <= b ) {
    printf( "%d = " , a ) ;
    factorizar1 ( 2 , a ,  b  ,  ver ) ;
    putchar ( '\n' );
    return descompon (  a + 1 ,  b ,  ver ) ;
  }
  return 0 ;
}
 
int factorizar1 (  int i , int numero , int b , int ver ) {
  int n = numero ;
  if ( i <= n ) {
    factorizar2 ( i , &n  , b , ver ) ;
    return factorizar1 ( i + 1  , n  ,  b  ,  ver ) ;
  }
  return 0 ;
}
 
void factorizar2 (  int i , int *n , int b , int ver  ) {
  while ( *n % i == 0 )
    *n /=  i , ver++ ;
  imprimir( i , *n , b , ver ) ;
}
 
void imprimir( int i , int n, int b , int ver ) {
  if ( ver != 0 ) {
    if ( ver == 1 && i < n )
      printf( "%d * " ,i ) ;
    else if ( ver == 1 && i > n )
      printf( "%d" ,i ) ;
    else if ( ver > 1 && i < n )
      printf( "%d^%d * " ,i , ver ) ;
    else if ( ver > 1 && i > n )
      printf( "%d^%d" ,i , ver )  ;
  }
}