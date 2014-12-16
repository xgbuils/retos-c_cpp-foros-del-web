#include <stdio.h>
#include <stdlib.h>
#include <math.h>
 
int SumaDigitos( int num , int suma ) {
  int factor = ( ( num ) % 10 ) * ( ( num ) % 10 ) ;
  if ( num ) { suma += ( num ) % 10 + factor * factor * factor ; return SumaDigitos ( num / 10 , suma ) ; }
  else return suma ;
}
 
int criba ( int numero , int num_1 , int nMax , int sumaDigitNum  ) {
  static int conT = 0 ;
  int num_2 = numero / num_1 ;
  if( num_1 <= nMax ) {
    num_2 = numero / num_1;
    if ( num_1 * num_2 == numero && ( num_1 % 10 != 0 || num_2 % 10 != 0  )
        && sumaDigitNum == SumaDigitos( num_1 , 0 ) + SumaDigitos( num_2 , 0 ) )
      { /*printf ( "%d = %d x %d  [%3u]\n", numero , num_1 , num_2, ++conT )  ;*/ return 1 ; }
  return criba ( numero , num_1 + 1 , nMax , sumaDigitNum ) ;
  }
  return 0 ;
}
 
int esVampiro( int numero ) {
  int  sumaDigitNum = SumaDigitos ( numero , 0 ) , ndigits = log10 ( numero ), nMin = 1 + numero / pow ( 10 , 1 + ndigits / 2 ), nMax = sqrt ( numero ) ;
  if ( --ndigits %2 != 0 ) return 0 ;
  return ( criba ( numero , nMin , nMax , sumaDigitNum ) == 0 ) ? 0 : 1 ;
}