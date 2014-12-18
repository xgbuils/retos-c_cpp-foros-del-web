// Autor: eferion
// Fecha: 09/12/2014, 00:53
// Enlace: http://www.forosdelweb.com/f96/petando-pila-problemas-retos-usando-recursividad-1113701/index4.html#post4661372

#include <stdio.h>

#define IMPRIMIR( base, exponente, primerPrimo, ver ) \
  if ( primerPrimo == 0 && ver) printf( " *" ); \
  if ( exponente == 1 && ver) printf( " %d", base ); \
  else if ( exponente > 0 && ver) printf( " %d^%d", base, exponente )
 
int ComprobarPrimo( int* numero, int candidato )
{
  if ( *numero % candidato == 0 )
  {
    *numero /= candidato;
    return 1 + ComprobarPrimo( numero, candidato );
  }
  return 0;
}

void bucleChequeo( int numero, int candidato, int primerPrimo, int ver )
{
  int exp = ComprobarPrimo( &numero, candidato );
  if ( exp > 0)
  {
    IMPRIMIR( candidato, exp, primerPrimo, ver);
    primerPrimo = 0;
  }
 
  candidato += 2;
  if ( numero > 1 )
    bucleChequeo( numero, candidato, primerPrimo, ver );
}
 
void descompon(int a, int b, int ver)
{
  int actual = a;
  int exp = ComprobarPrimo( &actual, 2 );

  if ( ver ) printf( "%d =", a );
  IMPRIMIR( 2, exp, 1, ver );
 
  bucleChequeo( actual, 3, exp == 0, ver );
 
  if ( ver )
    printf ( "\n" );
 
  if ( a < b )
    descompon( ++a, b, ver );
}