// Example program
#include <iostream>
#include <string>

using namespace std;


int main()
{
  float money;
  int anios;
  float entrada;
  float tipo;
  
  cout << "cuanto meter al mes? \n" ;

  cin >> entrada;
  cin >> money;
  cin >> anios;
  cin >> tipo;
  
  tipo=1+tipo*0.01;

    float pastagansa=3000;
    float anual=money*12;
    float totalsimple=3000;

 for (int i=0; i< anios; i++){
     
     totalsimple+=anual;
     pastagansa=((pastagansa+anual)*tipo);
     cout << i+1 << " " << anual << "     " << totalsimple << "  " <<  pastagansa << endl;
     anual=anual*1.03;
     
}
  
  cout << "esto vas a ganar bruto: ahorrado , " << totalsimple << "!\n";
  cout << "esto vas a ganar bruto: intereses, " << pastagansa - totalsimple << "!\n";
  cout << "esto vas a ganar bruto: ahorrado + intereses, " << pastagansa << "!\n";
  cout << "esto vas a ganar neto: ahorrado + intereses, " << pastagansa*0.77 << "!\n";
  
}  
