#include "../prototipo.h"
#include <stdio.h>
void test01() {
    int i, n;
    for (i = 10000000; i < 12000000; ++i) {
        if (esVampiro(i))
        	++n;
    }
    printf("%d", n);
}